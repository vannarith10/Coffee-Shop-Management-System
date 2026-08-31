//
// websocket/websocket-manager.ts
//
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useAuthStore } from "../stores/useAuthStore";
import { isTokenExpired } from "../utils/jwt";

type MessageHandler = (message: IMessage) => void;

interface SubscriptionEntry {
  stompSubscription: StompSubscription | null;
  handlers: Set<MessageHandler>;
}

class WebSocketManager {
  private client: Client | null = null;

  private subscriptions = new Map<string, SubscriptionEntry>();




  async connect() {
    if (this.client) {
      console.log("WebSocket already initialized.");
      return;
    }

    let token = useAuthStore.getState().accessToken;

    if (!token) {
      console.warn("WS: access token is missing.");
      return;
    }

    if (isTokenExpired(token, 30)){
      token = await useAuthStore.getState().refresh();
    }

    const client = new Client({
      brokerURL: `${
        import.meta.env.VITE_API_WEBSOCKET_BASE_URL
      }/ws?token=${token}`,

      reconnectDelay: 5000,

      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        /**
         * Ignore stale client callbacks.
         */
        if (this.client !== client) {
          console.log("Ignoring stale WebSocket connection.");
          return;
        }

        console.log("+++ WS Connected +++");

        this.restoreSubscriptions();
      },

      onDisconnect: () => {
        console.log("--- WS Disconnected ---");
      },

      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"]);
      },

      onWebSocketError: (event) => {
        console.error("WebSocket Error:", event);
      },

      // debug: (message) => {
      //   console.debug("[STOMP]", message);
      // },
    });

    this.client = client;

    client.activate();
  }






  subscribe(destination: string, handler: MessageHandler): () => void {
    let entry = this.subscriptions.get(destination);

    if (!entry) {
      entry = {
        stompSubscription: null,
        handlers: new Set(),
      };

      this.subscriptions.set(destination, entry);
    }

    entry.handlers.add(handler);

    /**
     * Already connected?
     * Subscribe immediately.
     */
    if (this.client?.connected && !entry.stompSubscription) {
      this.createStompSubscription(destination, entry);
    }

    return () => {
      const current = this.subscriptions.get(destination);

      if (!current) {
        return;
      }

      current.handlers.delete(handler);

      if (current.handlers.size === 0) {
        console.log(`--- Unsubscribing ---`);
        current.stompSubscription?.unsubscribe();
        this.subscriptions.delete(destination);
      }
    };
  }

  private createStompSubscription(
    destination: string,
    entry: SubscriptionEntry,
  ) {
    const client = this.client;

    if (!client) {
      return;
    }

    if (!client.connected) {
      return;
    }

    if (entry.stompSubscription) {
      return;
    }

    entry.stompSubscription = client.subscribe(destination, (message) => {
      entry.handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  
  private restoreSubscriptions() {
    console.log("Restoring WebSocket subscriptions...");

    console.log("Subscription count:", this.subscriptions.size);

    this.subscriptions.forEach((entry, destination) => {
      /**
       * Subscription object from a previous
       * connection is invalid after reconnect.
       */
      entry.stompSubscription = null;

      this.createStompSubscription(destination, entry);
    });
  }

  async disconnect() {
    console.log("--- Disconnecting WebSocket Manager ---");

    const client = this.client;

    /**
     * Prevent stale callbacks.
     */
    this.client = null;

    if (client) {
      await client.deactivate();
    }
  }
}

export const websocketManager = new WebSocketManager();

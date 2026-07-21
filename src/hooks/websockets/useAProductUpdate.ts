// hooks/useAProductUpdate.ts
// WebSocket

import { useEffect } from "react";
import type { Product } from "../../types/product";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../../utils/auth-storage";
import { toast } from "sonner";

interface Props {
  onProductUpdate: (product: Product) => void;
}

export function useAProductUpdate({ onProductUpdate }: Props) {
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        console.log("+ + + Connected + + +");
        client.subscribe("/topic/admin/product-update", (message) => {
          try {
            const product: Product = JSON.parse(message.body);
            onProductUpdate(product);
            toast.success("A product has been updated.", { duration: 5000 });
          } catch (error) {
            console.error(error);
          }
        });
      },

      onDisconnect: () => {
        console.log("- - - Disconnected - - -");
      },

      onStompError: (frame) => {
        console.error("Broker Error: ", frame.headers["message"]);
      },

      onWebSocketError: (event) => {
        console.error("WebSocket Error: ", event);
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [onProductUpdate]);
}

// hooks/useProductStockStatusUpdate.ts
//

import { useEffect } from "react";
import type { Product } from "../types/product";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../utils/auth-storage";
import { toast } from "sonner";

interface Props {
  onStockStatusUpdate: (product: Product) => void;
}

export function useProductStockStatusUpdate({ onStockStatusUpdate }: Props) {
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        console.log("+ + + CONNECTED + + +");
        client.subscribe("/topic/admin/stock-update", (message) => {
          try {
            const product: Product = JSON.parse(message.body);
            onStockStatusUpdate(product);
            toast.success("Product Stock Status Updated Successfully!", {
              duration: 3000,
            });
          } catch (error) {
            console.error(error);
          }
        });
      },

      onDisconnect: () => {
        console.log("- - - DISCONNECTED - - -");
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
    }
  }, [onStockStatusUpdate]);
}

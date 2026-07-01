// hooks/useCategoryUpdate.ts
// WebSocket
//
// =====================================================
// Receives data via WebSocket for updating Category UI
// =====================================================
//
import { useEffect } from "react";
import type { Category } from "../types/category";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../utils/auth-storage";
import { toast } from "sonner";

interface Props {
  onCategoryUpdate: (category: Category) => void;
}

export function useCategoryUpdate({ onCategoryUpdate }: Props) {
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        console.log("+ + + CONNECTED + + +");
        client.subscribe("/topic/admin/category-update", (message) => {
          try {
            const category: Category = JSON.parse(message.body);
            onCategoryUpdate(category);
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
    };
  }, [onCategoryUpdate]);
}

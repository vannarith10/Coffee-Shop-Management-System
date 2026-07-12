// hooks/useCategoryStatusUpdate.ts
// WebSocket

import { useEffect } from "react";
import type { CategoryStatusResponse } from "../types/category";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../utils/auth-storage";

export function useCategoryStatusUpdate({
  onUpdateCategoryStatus,
}: {
  onUpdateCategoryStatus: (newStatus: CategoryStatusResponse) => void;
}) {
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        console.log("+ + + Connected + + +");
        client.subscribe("/topic/admin/category-create-status", (message) => {
          try {
            const categoryStatus: CategoryStatusResponse = JSON.parse(
              message.body,
            );
            setTimeout(() => onUpdateCategoryStatus(categoryStatus), 2000);
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
  }, [onUpdateCategoryStatus]);
}

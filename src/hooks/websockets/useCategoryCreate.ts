// hooks/websockets/useCategoryCreate.ts
//

import { useEffect } from "react";
import type { Category } from "../../types/category";
import { toast } from "sonner";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../../utils/auth-storage";

interface Props {
    onCategoryCreate: (newCategory: Category) => void,
}


export function useCategoryCreate ({onCategoryCreate}:Props) {

    useEffect(() => {
        const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        console.log("+ + + Connected + + +");
        client.subscribe("/topic/admin/category-create", (message) => {
          try {
            const newCategory: Category = JSON.parse(message.body);
            onCategoryCreate(newCategory);
            toast.success("New Category has been created", { duration: 5000 });
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
    }, [onCategoryCreate]);
}
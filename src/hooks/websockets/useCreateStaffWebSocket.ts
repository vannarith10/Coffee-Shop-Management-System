// hooks/websockets/useCreateStaffWebSocket.ts

import { useEffect } from "react";
import type { Staff } from "../../types/staff";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../../utils/auth-storage";
import { toast } from "sonner";

interface Props {
  onAddNewStaff: (staff: Staff) => void;
}

export function useCreateStaffWebSocket({ onAddNewStaff }: Props) {
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        client.subscribe("/topic/admin/staff-create", (message) => {
          try {
            const staff: Staff = JSON.parse(message.body);
            onAddNewStaff(staff);
            toast.success("New staff account created", { duration: 5000 });
          } catch (err) {
            console.error(err);
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

  }, [onAddNewStaff]);
}

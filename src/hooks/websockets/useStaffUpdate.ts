// hooks/useStaffUpdate.ts
// WebSocket
//
//======================================================
// Used to Receive Data from WebSocket and Update Cache
//======================================================

import { useEffect } from "react";
import type { Staff } from "../../types/staff";
import { authStorage } from "../../utils/auth-storage";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";

interface Props {
  //   Receives parameter of type Staff, returns nothing
  onEmployeeUpdated: (employee: Staff) => void;
}

export function useStaffUpdate({ onEmployeeUpdated }: Props) {
  useEffect(() => {
    const client = new Client({
      brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

      onConnect: () => {
        console.log("+ + + Connected + + +");
        client.subscribe("/topic/admin/update-employee-details", (message) => {
          try {
            const employee: Staff = JSON.parse(message.body);
            onEmployeeUpdated(employee);
            toast.success("An employee profile has been updated.", {
              duration: 3000,
            });
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
  }, [onEmployeeUpdated]);
}

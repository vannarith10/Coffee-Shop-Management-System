// hooks/websockets/useCreateStaffWebSocket.ts
// WebSocket Manager
//
import { useEffect } from "react";
import type { Staff } from "../../types/staff";
import { toast } from "sonner";
import { websocketManager } from "../websocket-manager";

interface Props {
  onAddNewStaff: (staff: Staff) => void;
}

export function useCreateStaffWebSocket({ onAddNewStaff }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/staff-create",
      (message) => {
        try {
          const newStaff: Staff = JSON.parse(message.body);

          onAddNewStaff(newStaff);
          toast.success("New staff account created!", { duration: 5000 });
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onAddNewStaff]);
}

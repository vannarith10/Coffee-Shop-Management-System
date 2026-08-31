//
// websocket/staff/useStaffUpdate.ts
// WebSocket Manager
//
import { useEffect } from "react";
import type { Staff } from "../../types/staff";
import { toast } from "sonner";
import { websocketManager } from "../websocket-manager";

interface Props {
  //   Receives parameter of type Staff, returns nothing
  onEmployeeUpdated: (employee: Staff) => void;
}

export function useStaffUpdate({ onEmployeeUpdated }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/update-employee-details",
      (message) => {
        try {
          const updatedStaff: Staff = JSON.parse(message.body);

          onEmployeeUpdated(updatedStaff);
          toast.success("A staff profile has been updated!", {
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onEmployeeUpdated]);
}

//
// websocket/order/useGetQueuedOrder.ts | BARISTA
//
import { useEffect } from "react";
import type { BaristaOrderItem } from "../../types/barista/order";
import { websocketManager } from "../websocket-manager";
import { toast } from "sonner";

interface Props {
  onQueuedUpdate: (order: BaristaOrderItem) => void;
}

export function useGetQueuedOrder({ onQueuedUpdate }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/barista/order/queued",
      (message) => {
        try {
          const newOrder: BaristaOrderItem = JSON.parse(message.body);
          onQueuedUpdate(newOrder);
          toast.info("New order is arrived, #" + newOrder.order_number, {
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onQueuedUpdate]);
}

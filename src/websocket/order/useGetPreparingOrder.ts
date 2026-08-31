//
// websocket/order/useGetPreparingOrder.ts | BARISTA
//
import { useEffect } from "react";
import type { BaristaOrderItem } from "../../types/barista/order";
import { websocketManager } from "../websocket-manager";
import { toast } from "sonner";

interface Props {
  onPreparingUpdate: (order: BaristaOrderItem) => void;
}

export function useGetPreparingOrder({ onPreparingUpdate }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/barista/order/preparing",
      (message) => {
        try {
          const order: BaristaOrderItem = JSON.parse(message.body);
          onPreparingUpdate(order);
          toast.success("Order #" + order.order_number + " starts preparing", {
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onPreparingUpdate]);
}

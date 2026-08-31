//
// websocket/stock/useProductStockStatusUpdate.ts
// WebSocket Manager
//
import { useEffect } from "react";
import type { ProductStock } from "../../types/product";
import { toast } from "sonner";
import { websocketManager } from "../websocket-manager";

interface Props {
  onStockStatusUpdate: (product: ProductStock) => void;
}

export function useProductStockStatusUpdate({ onStockStatusUpdate }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/stock-update",
      (message) => {
        try {
          const product: ProductStock = JSON.parse(message.body);

          onStockStatusUpdate(product);
          toast.success("Product Stock Status has been updated!", {
            duration: 3000,
          });
        } catch (error) {
          console.error(error);
        }
      },
    );
    return unsubscribe;
  }, [onStockStatusUpdate]);
}

//
// websocket/product/useAProductUpdate.ts
// WebSocket Manager
//
import { useEffect } from "react";
import type { Product } from "../../types/product";
import { toast } from "sonner";
import { websocketManager } from "../websocket-manager";

interface Props {
  onProductUpdate: (product: Product) => void;
}

export function useAProductUpdate({ onProductUpdate }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/product-update",
      (message) => {
        try {
          const product: Product = JSON.parse(message.body);

          onProductUpdate(product);
          toast.success("A product has been updated!", { duration: 5000 });
        } catch (error) {
          console.error(error);
        }
      },
    );
    return unsubscribe;
  }, [onProductUpdate]);
}

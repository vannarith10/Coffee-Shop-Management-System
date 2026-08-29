// hooks/websockets/useCategoryCreate.ts
// WebSocket Manager
//
import { useEffect } from "react";
import type { Category } from "../../types/category/category";
import { toast } from "sonner";
import { websocketManager } from "../websocket-manager";

interface Props {
  onCategoryCreate: (newCategory: Category) => void;
}

export function useCategoryCreate({ onCategoryCreate }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/category-create",
      (message) => {
        try {
          const newCategory: Category = JSON.parse(message.body);

          onCategoryCreate(newCategory);

          toast.success("New Category has been created", {
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onCategoryCreate]);
}

import { useEffect } from "react";
import type { Category } from "../../types/category/category";
import { websocketManager } from "../websocket-manager";
import { toast } from "sonner";

interface Props {
  onCategoryUpdate: (category: Category) => void;
}

export function useUpdateCategoryWebsocket({ onCategoryUpdate }: Props) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/category/update",
      (message) => {
        try {
          const category: Category = JSON.parse(message.body);
          onCategoryUpdate(category);
          toast.success(
            "Category " + category.category_name + " has been updated",
            { duration: 5000 },
          );
        } catch (err) {
          console.error(err);
        }
      },
    );

    return unsubscribe;
  }, [onCategoryUpdate]);
}

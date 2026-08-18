// hooks/useCategoryStatusUpdate.ts
// Websocket Manager
//
import { useEffect } from "react";
import type { CategoryStatusSummaryResponse } from "../../types/category";
import { websocketManager } from "../../websocket/websocket-manager";
import { toast } from "sonner";

export function useCategoryStatusUpdate({
  onUpdateCategoryStatus,
}: {
  onUpdateCategoryStatus: (newStatus: CategoryStatusSummaryResponse) => void;
}) {
  useEffect(() => {
    const unsubscribe = websocketManager.subscribe(
      "/topic/admin/category-status-summary",
      (message) => {
        try {
          const updatedSummary: CategoryStatusSummaryResponse = JSON.parse(
            message.body,
          );

          onUpdateCategoryStatus(updatedSummary);
          toast.success("Category updated!", {
            duration: 5000,
          });
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onUpdateCategoryStatus]);
}

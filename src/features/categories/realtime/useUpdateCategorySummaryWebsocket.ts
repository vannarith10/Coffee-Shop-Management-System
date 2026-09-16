import { useEffect } from "react";
import type { CategoryStatusSummaryResponse } from "../types/category";
import { websocketManager } from "../../../websocket/websocket-manager";

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
        } catch (error) {
          console.error(error);
        }
      },
    );

    return unsubscribe;
  }, [onUpdateCategoryStatus]);
}

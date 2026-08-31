//
// websocket/category/useCategoryStatusUpdate.ts
// Websocket Manager
//
// ----------------------------------------------------------
//
// Category Summary of the Category Tab on Admin Dashboard
//
// ----------------------------------------------------------
//
import { useEffect } from "react";
import type { CategoryStatusSummaryResponse } from "../../types/category/category";
import { websocketManager } from "../websocket-manager";

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

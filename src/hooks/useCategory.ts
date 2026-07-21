// hooks/useCategory
//

import { useEffect, useState } from "react";
import { getAllCategories } from "../services/admin.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, GetAllCategoriesResponse } from "../types/category";
import { useCategoryCreate } from "./websockets/useCategoryCreate";

//==================================
// WebSocket
// Real-time update
// For update category
//==================================
// let stompClient: Client | null = null;
// // Set() accepts unique value, if we add the new same value, it will ignore.
// // Now, Set() is storing a non-return function that has a parameter with type Category
// // One Set() per topic
// const updateListeners = new Set<(category: Category) => void>();
// const createListeners = new Set<(category: Category) => void>();

// function ensureWebSocket() {
//   if (stompClient?.active) return;

//   stompClient = new Client({
//     brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

//     onConnect: () => {
//       console.log("+ + + CONNECTED + + +");
//       //=======================
//       // Topic: Category Update
//       //=======================
//       stompClient!.subscribe("/topic/admin/category-update", (message) => {
//         try {
//           const category: Category = JSON.parse(message.body);
//           // Notify every active useCategory instance
//           // listener(category) = handleUpdate(category)
//           updateListeners.forEach((listener) => listener(category));
//           // Show Toast
//           toast.success("Category Updated Successfully!", { duration: 3000 });
//         } catch (error) {
//           console.error(error);
//         }
//       });
//       //=======================
//       // Topic: Category Create
//       //=======================
//       stompClient!.subscribe("/topic/admin/category-create", (message) => {
//         try {
//           const category: Category = JSON.parse(message.body);
//           createListeners.forEach((listener) => listener(category));
//           toast.success("New Category Created!", { duration: 3000 });
//         } catch (error) {
//           console.error(error);
//         }
//       });
//     },

//     onDisconnect: () => console.log("- - - DISCONNECTED - - -"),
//     onStompError: (frame) =>
//       console.error("Broker Error: ", frame.headers["message"]),
//     onWebSocketError: (event) => console.error("WebSocket Error: ", event),

//     reconnectDelay: 5000,
//     heartbeatIncoming: 4000,
//     heartbeatOutgoing: 4000,
//   });

//   stompClient.activate();
// }

export function useCategory(page: number = 1, size: number = 10) {
  const queryClient = useQueryClient();
  const [justUpdatedFieldId, setJustUpdateFieldId] = useState<string | null>(
    null,
  );
  const [justCreatedCategoryId, setJustCreatedCategoryId] = useState<
    string | null
  >(null);
  const queryKey = ["category", page, size];
  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<GetAllCategoriesResponse>({
      queryKey,
      queryFn: () => getAllCategories({ page, size }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  // ===========================
  // Fetch next page
  // ===========================
  const totalPages = data?.pagination.total_pages ?? 1;
  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    queryClient.prefetchQuery({
      queryKey: ["category", nextPage, size],
      queryFn: () =>
        getAllCategories({ page: nextPage, size }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });
  }, [data, page, totalPages, size, queryClient]);

  // =================================================
  // WebSocket - Add a new Category that just created
  // =================================================
  function handleAddNewCategory(newCategory: Category) {
    setJustCreatedCategoryId(newCategory.category_id);
    queryClient.setQueriesData<GetAllCategoriesResponse>(
      { queryKey: ["category"] },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          // update total items to all pages
          pagination: {
            ...oldData.pagination,
            total_items: oldData.pagination.total_items + 1,
          },

          // add a new created to only the current page, not to all pages
          categories:
            oldData.pagination.page === page
              ? [...oldData.categories, newCategory]
              : oldData.categories,
        };
      },
    );
  }
  useCategoryCreate({ onCategoryCreate: handleAddNewCategory });

  // Clear category id after 5 sec
  useEffect(() => {
    setTimeout(() => setJustCreatedCategoryId(null), 5000);
  }, [justCreatedCategoryId]);

  return {
    category: data ?? null,
    isLoading,
    isError,
    isRefetching,
    refetch,
    justUpdatedFieldId,
    justCreatedCategoryId,
  };
}

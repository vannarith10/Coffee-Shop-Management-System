// hooks/useCategory
//

import { useEffect, useMemo, useState } from "react";
import type { GetAllCategoriesResponse, Category } from "../types/category";
import { getAllCategories } from "../services/admin.service";
import { toast } from "sonner";
import { addCategory, updateCategory } from "../utils/data-cache-update";
import { Client } from "@stomp/stompjs";
import { authStorage } from "../utils/auth-storage";

//==================================
// WebSocket
// Real-time update
// For update category
//==================================
let stompClient: Client | null = null;
// Set() accepts unique value, if we add the new same value, it will ignore.
// Now, Set() is storing a non-return function that has a parameter with type Category
// One Set() per topic
const updateListeners = new Set<(category: Category) => void>();
const createListeners = new Set<(category: Category) => void>();

function ensureWebSocket() {
  if (stompClient?.active) return;

  stompClient = new Client({
    brokerURL: `${import.meta.env.VITE_API_WEBSOCKET_BASE_URL}/ws?token=${authStorage.getAccessToken()}`,

    onConnect: () => {
      console.log("+ + + CONNECTED + + +");
      //=======================
      // Topic: Category Update
      //=======================
      stompClient!.subscribe("/topic/admin/category-update", (message) => {
        try {
          const category: Category = JSON.parse(message.body);
          // Notify every active useCategory instance
          // listener(category) = handleUpdate(category)
          updateListeners.forEach((listener) => listener(category));
          // Show Toast
          toast.success("Category Updated Successfully!", { duration: 3000 });
        } catch (error) {
          console.error(error);
        }
      });
      //=======================
      // Topic: Category Create
      //=======================
      stompClient!.subscribe("/topic/admin/category-create", (message) => {
        try {
          const category: Category = JSON.parse(message.body);
          createListeners.forEach((listener) => listener(category));
          toast.success("New Category Created!", { duration: 3000 });
        } catch (error) {
          console.error(error);
        }
      });
    },

    onDisconnect: () => console.log("- - - DISCONNECTED - - -"),
    onStompError: (frame) =>
      console.error("Broker Error: ", frame.headers["message"]),
    onWebSocketError: (event) => console.error("WebSocket Error: ", event),

    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.activate();
}

//==================================
// Hook
// Category
// Cache
// Handling
// Category data for UI
//==================================
export function useCategory(page: number = 1, size: number = 10) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageCache, setPageCache] = useState<
    Record<number, GetAllCategoriesResponse>
  >({});

  const category = useMemo(() => pageCache[page] ?? null, [pageCache, page]);
  const [justUpdatedFieldId, setJustUpdateFieldId] = useState<string | null>(
    null,
  );

  //=========================
  // Fetch Data from API
  //=========================
  useEffect(() => {
    // If the page alread in cache, don't request again.
    if (pageCache[page]) return;

    async function fetchData() {
      setIsLoading(true);
      setIsError(false);

      try {
        const res = await getAllCategories({ page, size });
        setPageCache((prev) => ({ ...prev, [page]: res.data }));
      } catch (error) {
        console.error(error);
        setIsError(true);
        toast.error("Error loading categories", { duration: 3000 });
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    }

    fetchData();
  }, [page, size, pageCache]);

  // =================================================
  // Highlight the field that just updated for 3s
  // =================================================
  useEffect(() => {
    if (!justUpdatedFieldId) return;
    const timer = setTimeout(() => setJustUpdateFieldId(null), 3000);
    return () => clearTimeout(timer);
  }, [justUpdatedFieldId]);

  //====================================
  // Update Category with WebSocket
  //====================================
  useEffect(() => {
    // Function to update Category Cache
    const handleUpdate = (updatedCategory: Category) => {
      setPageCache((prev) => updateCategory(prev, updatedCategory));
      setJustUpdateFieldId(updatedCategory.category_id);
    };

    // Add "handleUpdate" to Set() before calling websocket()
    updateListeners.add(handleUpdate);
    // Checks if stomp connection already exists. If not, creates it.
    ensureWebSocket();

    // Cleanup function
    // Removes "handleUpdate" from Set()
    // Prevent updates on unmounted components
    return () => {updateListeners.delete(handleUpdate);}
  }, []);
  // Empty dependency: subscribe once per component instance
  // No re-subscribe
  // No dubplicate connections
  // Connection & Subscription stay alive for a lifetime



  //===============================
  // Subscribe to Create Topic
  //===============================
  useEffect(() => {

    const handleCreate = (cat: Category) => {
      setPageCache((prev) => addCategory(prev, cat, page));
    }
    createListeners.add(handleCreate);
    ensureWebSocket();

    return () => {createListeners.delete(handleCreate);}
  }, [page]);



  return {
    category,
    pageCache,
    isLoading,
    isError,
    justUpdatedFieldId,
  };
}

//
// components/barista/QueueOrder.tsx
//
import { useEffect, useRef } from "react";
import { useRetrieveOrder } from "../../hooks/barista/useRetrieveOrder";
import Masonry from "react-masonry-css";
import OrderCard from "./OrderCard";
import { AnimatePresence, motion } from "framer-motion";
import { useUpdateOrderStatus } from "../../hooks/barista/useUpdateOrderStatus";
import { toast } from "sonner";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type {
  BaristaOrderItem,
  BaristaOrderQueue,
} from "../../types/barista/order";
import { useGetQueuedOrder } from "../../websocket/order/useGetQueuedOrder";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

const QueueOrder = () => {
  const size = 20;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useRetrieveOrder({ size: size, status: "QUEUED" });
  const queued = data?.pages.flatMap((page) => page.barista_order_items) ?? [];
  const loadMoreRef = useRef(null);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const queryClient = useQueryClient();

  // Loading next page
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  //
  // Remove an order from Queue data catche that status = QUEUED
  //
  function handleRemoveOrderFromQueue(id: string) {
    queryClient.setQueryData<InfiniteData<BaristaOrderQueue>>(
      ["barista-order", size, "QUEUED"],
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            barista_order_items: page.barista_order_items.filter(
              (o) => o.order_id !== id,
            ),
          })),
        };
      },
    );
  }

  //
  // Adds new arriving order to the catche
  //
  function handleAddOrderToQueue(order: BaristaOrderItem) {
    queryClient.setQueryData<InfiniteData<BaristaOrderQueue>>(
      ["barista-order", size, "QUEUED"],
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page, index) => {
            const isLastPage = index === old.pages.length - 1;

            return isLastPage
              ? {
                  ...page,
                  barista_order_items: [...page.barista_order_items, order],
                }
              : page;
          }),
        };
      },
    );
  }

  // WebSocket - update
  useGetQueuedOrder({ onQueuedUpdate: handleAddOrderToQueue });

  // Update Status QUEUE -> PREPARING
  function handleUpdateStatus(id: string) {
    updateStatus(
      { id: id, status: "PREPARING" },
      {
        onError: (error) => {
          toast.error(error.response?.data.detail, { duration: 5000 });
        },

        onSuccess: () => {
          handleRemoveOrderFromQueue(id);
        },
      },
    );
  }

  // Cancel order
  function handleCancelOrder(id: string) {
    updateStatus(
      { id: id, status: "CANCELLED" },
      {
        onError: (error) => {
          toast.error(error.response?.data.detail, { duration: 5000 });
        },

        onSuccess: () => {
          toast.info(
            "Order #" +
              queued.find((q) => q.order_id === id)?.order_number +
              " has been cancelled",
          );
          // remove from catche
          handleRemoveOrderFromQueue(id);
        },
      },
    );
  }

  return (
    <div className="bg-background-secondary p-6 rounded-lg">
      <h3 className=" flex justify-between items-center ">
        <span className="font-bold text-lg uppercase">Queue</span>
        <button
          onClick={() => refetch()}
          className="font-bold px-4 py-2 bg-background-secondary-hover cursor-pointer hover:bg-sidebar active:scale-80 outline-none transition-all duration-300 ease-out"
        >
          {isRefetching ? "Refreshing..." : "Refresh"}
        </button>
      </h3>

      {queued.length === 0 && (
        <div className="w-full py-10 flex justify-center items-center">
          <p className="font-bold">No Order</p>
        </div>
      )}

      <AnimatePresence>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-6 mt-6"
          columnClassName="space-y-6"
        >
          {queued.map((order) => (
            <motion.div
              key={order.order_id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                transition: {
                  duration: 0.25,
                  ease: "easeOut",
                },
              }}
            >
              <OrderCard
                order={order}
                onClick={() => handleUpdateStatus(order.order_id)}
                onCancel={() => handleCancelOrder(order.order_id)}
                buttonText="Start Preparing"
              />
            </motion.div>
          ))}
        </Masonry>
      </AnimatePresence>

      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default QueueOrder;

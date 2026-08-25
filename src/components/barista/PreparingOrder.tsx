//
// components/barista/PreparingOrder.tsx
//
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Masonry from "react-masonry-css";
import OrderCard from "./OrderCard";
import { useRetrieveOrder } from "../../hooks/barista/useRetrieveOrder";
import { useUpdateOrderStatus } from "../../hooks/barista/useUpdateOrderStatus";
import { toast } from "sonner";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type {
  BaristaOrderItem,
  BaristaOrderQueue,
} from "../../types/barista/order";
import { useGetPreparingOrder } from "../../hooks/websockets/order/useGetPreparingOrder";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

const PreparingOrder = () => {
  const size = 20;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useRetrieveOrder({ size: size, status: "PREPARING" });
  const preparing =
    data?.pages.flatMap((page) => page.barista_order_items) ?? [];
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
  // Remove an order from queue data catche that status = PREPARING
  //
  function handleRemoveOrderFromQueue(id: string) {
    queryClient.setQueryData<InfiniteData<BaristaOrderQueue>>(
      ["barista-order", size, "PREPARING"],
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

  // Preparing -> DONE
  function handleUpdateStatus(id: string) {
    updateStatus(
      { id: id, status: "DONE" },
      {
        onError: (error) => {
          toast.error(error.response?.data.detail, { duration: 3000 });
        },

        onSuccess: () => {
          toast.success(
            "Order " +
              "#" +
              preparing.find((o) => o.order_id === id)?.order_number +
              " is done",
            { duration: 5000 },
          );

          // remove from catche
          handleRemoveOrderFromQueue(id);
        },
      },
    );
  }

  // CANCEL
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
              preparing.find((p) => p.order_id === id)?.order_number +
              " has been cancelled",
          );
          // remove from catche
          handleRemoveOrderFromQueue(id);
        },
      },
    );
  }

  //
  // Adds new Preparing order to the catche, it comes from WebSocket
  //
  function handleAddOrderToQueue(order: BaristaOrderItem) {
    queryClient.setQueryData<InfiniteData<BaristaOrderQueue>>(
      ["barista-order", size, "PREPARING"],
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

  // WebSocket update
  useGetPreparingOrder({ onPreparingUpdate: handleAddOrderToQueue });

  return (
    <div className="bg-background-secondary p-6 rounded-lg">
      <h3 className=" flex justify-between items-center ">
        <span className="font-bold text-lg uppercase">Preparing</span>
        <button
          onClick={() => refetch()}
          className="font-bold px-4 py-2 bg-background-secondary-hover cursor-pointer hover:bg-sidebar active:scale-80 outline-none transition-all duration-300 ease-out"
        >
          {isRefetching ? "Refreshing..." : "Refresh"}
        </button>
      </h3>

      {preparing.length === 0 && (
        <div className="w-full py-10 flex justify-center items-center">
          <p className="font-bold">No Order in Preparing</p>
        </div>
      )}

      <AnimatePresence>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-6 mt-6"
          columnClassName="space-y-6"
        >
          {preparing.map((pre) => (
            <motion.div
              key={pre.order_id}
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
                order={pre}
                onClick={() => handleUpdateStatus(pre.order_id)}
                onCancel={() => handleCancelOrder(pre.order_id)}
                buttonText="Done"
              />
            </motion.div>
          ))}
        </Masonry>
      </AnimatePresence>

      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default PreparingOrder;

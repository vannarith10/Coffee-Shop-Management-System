//
// components/cashier/Menu
//
import { useEffect, useRef } from "react";
import { useGetProductMenu } from "../../hooks/cashier/useGetProductMenu";
import { useProductFilter } from "../../hooks/useProductFilter";
import NoImage from "../../assets/no-image.webp";
import { motion } from "framer-motion";
import { useGetAllCategoryNames } from "../../hooks/useGetAllCategoryNames";
import useCartStore from "../../hooks/cashier/useCartStore";
import type { ProductMenuItem } from "../../types/product";

const Menu = () => {
  const { addToCart } = useCartStore();
  const size = 20;
  const loadMoreRef = useRef(null);
  const { selectedCategoryName, selectedCategoryType, keyword } =
    useProductFilter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useGetProductMenu({
    size,
    categoryType: selectedCategoryType,
    categoryName: selectedCategoryName,
    keyword,
  });

  const { refetchCategoryName } = useGetAllCategoryNames();

  const products = data?.pages.flatMap((page) => page.items) ?? [];

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

  // Handle add to cart
  function handleAddToCart(product: ProductMenuItem) {
    addToCart(product);
  }

  // ==========================
  // Handle loading
  // ==========================
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 20 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 border-2 border-border p-4 rounded-2xl bg-background-secondary animate-pulse"
          >
            {/* Image sample */}
            <div className="relative w-full aspect-square rounded-lg bg-background-tertiary overflow-hidden">
              {/* Price Badge */}
              <div className="absolute top-2 right-2 h-7 w-14 rounded-md bg-background-secondary" />
            </div>

            {/* Product Name */}
            <div className="space-y-2 mt-1">
              <div className="h-4 w-3/4 rounded bg-background-tertiary" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==================
  // Handle Error
  // ==================
  if (isError) {
    return (
      <div className="w-full flex flex-col h-lvh -mt-20 gap-4 justify-center items-center bg-background-secondary">
        <p className="text-text-error font-bold text-lg">
          Error load product menu
        </p>
        <button
          onClick={() => {
            refetch();
            refetchCategoryName();
          }}
          className="px-4 py-2 bg-background-secondary-hover rounded-md cursor-pointer active:scale-80 outline-none transition-all duration-300 ease-out"
        >
          Try again
        </button>
      </div>
    );
  }

  // ===============================
  // Finally, No Loading & No Error
  // ===============================
  return (
    <>
      {/* I added "key" for this section because I want to force this section to remount whenever the "selectedCategoryType" changes */}
      {/* When selectedCategory changes, React destroys the grid and recreates it, replaying all animations again */}
      {/* Without this, motion animation will run only once when components mount */}
      <section
        key={selectedCategoryType}
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 pt-0 "
      >
        {/* =============================== */}
        {/* Display all item cards here */}
        {/* =============================== */}
        {products.map((i, idx) => {
          const isOut = i.stock_status === "OUT_OF_STOCK";
          return (
            <motion.button
              key={i.id}
              initial={{ opacity: 0, scale: 0.8, y: -100, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 6,
                duration: 0.3,
                delay: (idx % size) * 0.05,
              }}
              onClick={() => handleAddToCart(i)}
              disabled={isOut}
              className={`flex flex-col items-start gap-2 ${isOut ? "bg-pink-600/50" : "shimmer shimmer-bg shimmer-color-blue-300/50 shimmer-duration-3000 bg-background-secondary hover:bg-background-secondary-hover active:scale-80"} border border-border p-4 rounded-2xl cursor-pointer outline-none transition-all duration-300 ease-out`}
            >
              <div className="relative w-full max-w-full aspect-square">
                {/* product image */}
                <img
                  src={i.image_url || NoImage}
                  alt="product image"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg"
                />
                {isOut && (
                  <div className="absolute inset-0 bg-gray-500/60 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-sm lg:text-xl text-pink-300">
                      OUT
                    </span>
                  </div>
                )}
                {/* product price */}
                <span
                  className={`absolute ${isOut ? "bg-pink-500" : "bg-red-400"} text-white right-2 top-2 font-bold text-sm px-2 py-1 rounded-md`}
                >
                  ${i.price}
                </span>
              </div>
              {/* product name */}
              <h3 className="font-bold text-xs md:text-sm text-left truncate text-ellipsis w-full ">
                {i.name}
              </h3>
            </motion.button>
          );
        })}
      </section>

      <div ref={loadMoreRef} className="h-1" />
    </>
  );
};

export default Menu;

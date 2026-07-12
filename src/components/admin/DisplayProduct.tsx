// components/DisplayProduct.tsx
//

import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminProductResponse } from "../../types/product";
import { toast } from "sonner";
import axios from "axios";
import { getAllProducts } from "../../services/admin.service";
import NoImage from "../../assets/no-image.webp";
import { STOCK_STATUS_CONFIG } from "../../types/stock-status";
import { Ellipsis, RotateCcw, SquareChartGantt } from "lucide-react";
import { getPageNumbers } from "../../utils/page-numbers";
import { useNavigate } from "react-router-dom";
import TextLoader from "../ui/TextLoader";
import { Vibrant } from "node-vibrant/browser";
import { motion, stagger, AnimatePresence } from "motion/react";

export default function DisplayProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagesCache, setPagesCache] = useState<
    Record<number, AdminProductResponse>
  >({});
  const [page, setPage] = useState(1);
  const size = 10;
  const products = useMemo(() => pagesCache[page] ?? null, [page, pagesCache]);
  const currentPage = products?.pagination.page || page;
  const totalPages = products?.pagination.total_pages || 1;
  const totalItems = products?.pagination.total_items || 0;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const handlePrev = () => setPage((p) => p - 1);
  const handleNext = () => setPage((p) => p + 1);
  const handlePageClick = (pageNum: number) => setPage(pageNum);
  const navigate = useNavigate();
  const [refetchVersion, setRefetchVersion] = useState(1);

  const [gradients, setGradients] = useState<Record<string, string>>({});
  const targetRef = useRef<HTMLDivElement | null>(null);

    const scrollToComponent = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // ==============================
  // Fetching Data
  // ==============================
  useEffect(() => {
    setTimeout(() => scrollToComponent(), 200)
    if (pagesCache[page]) {
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await getAllProducts({ page: page, size: size });
        setPagesCache((prev) => ({ ...prev, [page]: res.data }));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errData = error.response?.data as {
            message: string;
            status: number;
            timestamp: string;
            detail: string;
          };
          toast.error(errData?.detail ?? "Unexpected error");
          setIsError(true);
        }
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }

    fetchData();
  }, [page, pagesCache, refetchVersion]);

  // ======================================
  //   Retry
  // ======================================
  function handleRetry() {
    setPage(1); // Reset to first page
    setRefetchVersion((v) => v + 1);
  }

  // ====================================
  // Generate Gradient Colors
  // ====================================
  useEffect(() => {
    products?.product_items?.forEach((product) => {
      if (!product.image_url) return;

      Vibrant.from(product.image_url)
        .getPalette()
        .then((palette) => {
          const swatches = Object.values(palette)
            .filter((s): s is NonNullable<typeof s> => !!s)
            .sort((a, b) => b.population - a.population);

          const primary = swatches[0]?.hex ?? "#444";
          const secondary = swatches[1]?.hex ?? primary;
          const tertiary = swatches[2]?.hex ?? secondary;
          setGradients((prev) => ({
            ...prev,
            [product.id]: `
              radial-gradient(circle at 20% 20%, ${primary}, transparent 45%),
              radial-gradient(circle at 80% 25%, ${secondary}, transparent 45%),
              radial-gradient(circle at 50% 85%, ${tertiary}, transparent 55%),
              linear-gradient(
                180deg,
                ${secondary},
                ${primary}
              )
            `,
          }));
        })
        .catch(console.error);
    });
  }, [products]);

  // "linear-gradient(to bottom, #333, #111)"

  return (
    <section ref={targetRef} className="w-full rounded-lg overflow-hidden border-border border-2">
      {/* ======================== */}
      {/* HEADER */}
      {/* ======================== */}
      <header>
        {/* Icon & Pagination Info */}
        <div className="w-full p-6 flex justify-between items-center bg-background-secondary-hover">
          <div className="flex gap-4">
            <SquareChartGantt />
            <h3 className="font-semibold">Products</h3>
          </div>
          {/*  */}
          {/* Pages and Items */}
          {!isLoading && !isError && (
            <div>
              <h4 className="font-semibold text-xs text-text-secondary">
                Page {currentPage} of {totalPages}
              </h4>
              <h4 className="font-semibold text-sm">Profiles: {totalItems}</h4>
            </div>
          )}
        </div>
        {/* ========================= */}
        {/* Colum Titles */}
        {/* ========================= */}
        <div className="grid grid-cols-5 items-center-safe bg-sidebar py-4 px-4 font-bold uppercase text-sm">
          <h2 className="text-start font-bold text-xs md:text-sm lg:text-lg">
            Image
          </h2>
          <h2 className="text-center font-bold text-xs md:text-sm lg:text-lg">
            Name
          </h2>
          <h2 className="text-center font-bold text-xs md:text-sm lg:text-lg">
            Category
          </h2>
          <div className="flex flex-col">
            <h2 className="text-center font-bold text-xs md:text-sm lg:text-lg">
              Price
            </h2>
            <h2 className="text-center text-amber-500 font-bold text-xs md:text-sm lg:text-lg">
              Cost
            </h2>
          </div>
          <h2 className="text-end font-bold text-xs md:text-sm lg:text-lg">
            Status
          </h2>
        </div>
      </header>

      {/* ================================== */}
      {/* Handle Loading */}
      {/* ================================== */}
      {isLoading && !isError && (
        <div className="w-full py-20 flex justify-center items-center text-xl font-bold ">
          <TextLoader text="Loading..." />
        </div>
      )}

      {/* ================================== */}
      {/* Error handling */}
      {/* ================================== */}
      {isError && (
        <div className="w-full py-20 flex flex-col justify-center items-center gap-4">
          <p className="text-lg font-semibold text-text-error">
            Failed to load product stock data. Please try again.
          </p>
          <button
            onClick={handleRetry}
            className="bg-background-secondary-hover font-bold py-2 px-4 rounded-md flex gap-2 hover:bg-sidebar cursor-pointer active:scale-80 transition-all duration-200 ease-out"
          >
            Retry <RotateCcw />
          </button>
        </div>
      )}

      {/* =============================== */}
      {/* List Items */}
      {/* =============================== */}
      {!isLoading && !isError && (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {products?.product_items?.map((product) => {
              const config = STOCK_STATUS_CONFIG[product.stock_status];
              return (
                <motion.button
                  key={product.id}
                  variants={itemVariants}
                  whileTap={{ scale: 0.95 }}
                  layout
                  onClick={() => {
                    setTimeout(() => navigate(`${product.id}`), 300);
                  }}
                  className={`relative grid grid-cols-5 w-full items-center-safe bg-cover bg-center  p-4 cursor-pointer active:px-10 overflow-hidden hover:pl-10 transition-all duration-100 ease-out`}
                  style={{ backgroundImage: gradients[product.id] }}
                >
                  {/* Overlay with blur */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                  {/* -------------------------- */}
                  {/* Product Image */}
                  {/* -------------------------- */}
                  <img
                    src={product.image_url || NoImage}
                    alt="Product image"
                    className="w-20 h-20 z-10 lg:w-24 lg:h-24 rounded-md border-2 border-border object-cover"
                  />
                  {/* -------------------------- */}
                  {/* Product Name */}
                  {/* -------------------------- */}
                  <h3 className="font-bold z-10 text-xs md:text-sm lg:text-lg text-white">
                    {product.name}
                  </h3>
                  {/* -------------------------- */}
                  {/* Product category */}
                  {/* -------------------------- */}
                  <div className="flex flex-col z-10 transition-colors duration-300 ease-out">
                    <h5 className="text-[8px] md:text-[10px] lg:text-xs text-text-secondary font-bold">
                      {product.category_type}
                    </h5>
                    <h4 className="text-xs md:text-sm font-bold">
                      {product.category_name}
                    </h4>
                  </div>
                  {/* -------------------------- */}
                  {/* Product price */}
                  {/* -------------------------- */}
                  <div className="flex flex-col z-10 transition-colors duration-300 ease-out">
                    <span className="font-bold text-sm md:text-lg">
                      ${product.price}
                    </span>
                    <span className="text-[10px] md:text-xs lg:text-sm text-amber-600 font-bold">
                      ${product.cost_price}
                    </span>
                  </div>
                  {/* -------------------------- */}
                  {/* Product status */}
                  {/* -------------------------- */}
                  <span
                    className={`text-sm z-10 font-bold inline-flex justify-self-end px-2 py-1 rounded-sm ${config.colorClass} transition-colors duration-300 ease-out`}
                  >
                    {config.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ================= */}
      {/* FOOTER */}
      {/* ================= */}
      <footer>
        <div className="flex bg-background-secondary justify-between px-6 py-4 border-t-4 border-border">
          {/* =================== */}
          {/* PREV */}
          {/* =================== */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
          >
            Prev
          </button>
          {/* ============================= */}
          {/* 1 2 3 ... 4 */}
          {/* Page Numbers */}
          {/* ============================= */}
          {!isLoading && !isError && (
            <div className="flex items-center justify-center gap-2">
              {getPageNumbers(totalPages, currentPage).map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-3 py-2 text-text-secondary"
                  >
                    <Ellipsis />
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageClick(pageNum as number)}
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all duration-200 cursor-pointer ${pageNum === currentPage ? "bg-green-600 text-white hover:bg-green-500" : "bg-sidebar text-white hover:bg-background-secondary-hover"}`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
          )}
          {/* ================= */}
          {/* NEXT */}
          {/* ================= */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`${hasNext ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"} font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}

// For styles & animations

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.80,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
};

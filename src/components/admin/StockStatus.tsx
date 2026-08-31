//
// components/admin/StockStatus.tsx
//
import { Layers2, SquarePen } from "lucide-react";
import type { ProductStock } from "../../types/product";
import { useState } from "react";
import { STOCK_STATUS_CONFIG } from "../../types/stock-status";
import { Ellipsis } from "lucide-react";
import { RotateCcw } from "lucide-react";
import UpdateStockStatus from "./UpdateStockStatus";
import TextLoader from "../ui/TextLoader";
import { useStockStatus } from "../../hooks/useStockStatus";
import { getPageNumbers } from "../../utils/page-numbers";
import { AnimatePresence } from "framer-motion";
import PageHeader from "../ui/PageHeader";
import { useSearchParams } from "react-router-dom";
import PageFooter from "../ui/PageFooter";

export default function StockStatus() {
  const size = 20;

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("stockPage") || 1);

  // Select a product and pass it to Update Form
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(
    null,
  );

  // Retreive data from hook
  const {
    data: product,
    isLoading,
    isError,
    refetch,
    isRefetching,
    justUpdatedIds,
  } = useStockStatus({
    page,
    size,
  });

  // Hanle Error fetching data
  function handleRetry() {
    refetch();
  }

  // =============================
  // Pagination logic
  // =============================
  const currentPage = product?.pagination.page ?? page;
  const totalPages = product?.pagination.total_pages ?? 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const totalItems = product?.pagination.total_items ?? 0;

  const handlePrev = () => {
    if (!hasPrev) return;

    setSearchParams((prev) => {
      prev.set("stockPage", String(page - 1));
      return prev;
    });
  };

  const handleNext = () => {
    if (!hasNext) return;

    setSearchParams((prev) => {
      prev.set("stockPage", String(page + 1));
      return prev;
    });
  };

  const handlePageClick = (pageNum: number) => {
    setSearchParams((prev) => {
      prev.set("stockPage", String(pageNum));
      return prev;
    });
  };

  return (
    <>
      <section className="w-full bg-background-secondary text-text-primary rounded-lg mt-4 overflow-hidden border-border border-2">
        {/* ------------------------------------
                        Header
        ------------------------------------- */}
        <PageHeader
          headerIcon={<Layers2 />}
          headerTitle="Stock Status"
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          refetch={refetch}
          isRefetching={isRefetching}
        />

        {/* ===================================== */}
        {/* Handle Loading */}
        {/* ===================================== */}
        {isLoading && !isError && (
          <div className="w-full py-20 flex justify-center items-center text-xl font-bold ">
            <TextLoader text="Loading..." />
          </div>
        )}
        {/* ===================================== */}
        {/* Hanlde Error and Retry */}
        {/* ===================================== */}
        {isError && !isLoading && (
          <div className="w-full py-10 flex flex-col justify-center items-center gap-4">
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

        {/* -----------------------------------------------------------
                              *
                                Display Items
                              *  
        ------------------------------------------------------------ */}
        {!isLoading && !isError && product?.products.length == 0 ? (
          <div className="w-full flex justify-center items-center py-20 font-bold">
            No data
          </div>
        ) : (
          product?.products.map((p: ProductStock) => {
            const config = STOCK_STATUS_CONFIG[p.status];
            const justUpdated = justUpdatedIds.has(p.id);
            return (
              <div
                key={p.id}
                className={`${config.bg20} ${config.bg50_hover} grid grid-cols-2 items-center px-6 py-4 text-xs xl:text-base border-t border-border-hover ${justUpdated && "shimmer shimmer-bg shimmer-color-blue-500 shimmer-duration-2500"} `}
              >
                {/* ---------------------------------
                        Name & Category
                ---------------------------------- */}
                <div className=" flex flex-col gap-2 ">
                  {/* Product Name */}
                  <h4 className=" font-bold text-sm sm:text-lg lg:text-xl">
                    {p.name}
                  </h4>
                  {/* Catogory */}
                  <div className="h-full flex flex-col justify-center">
                    <h5 className="text-[10px] xl:text-xs uppercase">
                      {p.category_type}
                    </h5>
                    <h5 className="font-semibold">{p.category_name}</h5>
                  </div>
                </div>

                {/* ---------------------------------
                        Status & Button
                ---------------------------------- */}
                <div className={` w-full flex justify-between gap-2 `}>
                  {/* status label */}
                  <span
                    className={`${config.bg}  content-center w-fit px-4 py-1 font-bold text-white text-xs font-mono tracking-widest text-center uppercase`}
                  >
                    {config.label}
                  </span>

                  {/* Update Stock Status Button */}
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="py-1 px-2 rounded-md lg:px-6 bg-green-600 text-white text-sm font-bold justify-self-end cursor-pointer hover:bg-green-700 active:scale-80 focus:outline-none transition-all duration-300 ease-out"
                  >
                    <SquarePen />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* =================================================== */}
        {/* Footer of the Stock Status Board */}
        {/* The bottom of the Stock Status board */}
        {/* Pagination */}
        {/* =================================================== */}
        <PageFooter
          handlePrev={handlePrev}
          handleNext={handleNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
        />

        {/*  */}
      </section>

      {/* ==================================================== */}
      {/* Form */}
      {/* Open this form when we click the restock button */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <UpdateStockStatus
            product={selectedProduct}
            isOpen={true}
            onClose={() => {
              setSelectedProduct(null);
              document.body.classList.remove("overflow-hidden");
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

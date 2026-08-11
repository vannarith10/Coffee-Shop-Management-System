// components/DisplayProduct.tsx
//

import { useEffect, useRef, useState } from "react";
import NoImage from "../../assets/no-image.webp";
import { STOCK_STATUS_CONFIG } from "../../types/stock-status";
import { Ellipsis, RotateCcw, SquareChartGantt } from "lucide-react";
import { getPageNumbers } from "../../utils/page-numbers";
import { useNavigate } from "react-router-dom";
import TextLoader from "../ui/TextLoader";
import { useAdminProduct } from "../../hooks/useAdminProduct";
import { useProductFilter } from "../../hooks/useProductFilter";


export default function DisplayProduct() {
  const [page, setPage] = useState(1);
  const size = 20;

  const { selectedCategoryName, selectedCategoryType, keyword } = useProductFilter();

  const { products, isLoading, isError, isRefetching, refetch } =
    useAdminProduct({
      page,
      size,
      categoryType: selectedCategoryType,
      categoryName: selectedCategoryName,
      keyword,
    });

  const currentPage = products?.pagination.page || page;
  const totalPages = products?.pagination.total_pages || 1;
  const totalItems = products?.pagination.total_items || 0;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const handlePrev = () => setPage((p) => p - 1);
  const handleNext = () => setPage((p) => p + 1);
  const handlePageClick = (pageNum: number) => setPage(pageNum);
  const navigate = useNavigate();
  const targetRef = useRef<HTMLDivElement | null>(null);

  // ==============
  // Scroll up
  // ==============
  // const scrollToComponent = () => {
  //   targetRef.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  useEffect(() => {
    // scrollToComponent();
  }, [page]);

  useEffect(() => {
    (function reset() {
      setPage(1);
    })();
  }, [selectedCategoryName, selectedCategoryType, keyword]);

  return (
    <section
      ref={targetRef}
      className="w-full rounded-lg overflow-hidden border-border border-2"
    >
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
            <div className="flex gap-4">
              <div>
                <h4 className="font-semibold text-xs text-text-secondary">
                  Page {currentPage} of {totalPages}
                </h4>
                <h4 className="font-semibold text-sm">
                  Products: {totalItems}
                </h4>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 flex gap-2 font-semibold bg-background-secondary rounded-lg cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none"
              >
                {isRefetching ? (
                  "Syncing..."
                ) : (
                  <>
                    Refresh <RotateCcw />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        {/* ========================= */}
        {/* Colum Titles */}
        {/* ========================= */}
        <div className="grid grid-cols-5 items-center-safe bg-sidebar py-4 px-4 font-bold uppercase text-sm">
          <h2 className="text-start font-bold text-xs lg:text-sm xl:text-lg">
            Image
          </h2>
          <h2 className="text-center font-bold text-xs lg:text-sm xl:text-lg">
            Name
          </h2>
          <h2 className="text-center font-bold text-xs lg:text-sm xl:text-lg">
            Category
          </h2>
          <div className="flex flex-col">
            <h2 className="text-center font-bold text-xs lg:text-sm xl:text-lg">
              Price
            </h2>
            <h2 className="text-center text-amber-500 font-bold text-xs lg:text-sm xl:text-lg">
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
            onClick={() => refetch()}
            className="bg-background-secondary-hover font-bold py-2 px-4 rounded-md flex gap-2 hover:bg-sidebar cursor-pointer active:scale-80 transition-all duration-200 ease-out"
          >
            Retry <RotateCcw />
          </button>
        </div>
      )}

      {/* ================================================================ */}
      {/* List Items */}
      {/* ================================================================ */}
      {!isLoading && !isError && (
        <>
          {products!.product_items?.length > 0 ? (
            products?.product_items?.map((product) => {
              const config = STOCK_STATUS_CONFIG[product.stock_status];
              return (
                <button
                  key={product.id}
                  onClick={() => {
                    setTimeout(() => navigate(`${product.id}`), 300);
                  }}
                  className={`relative grid grid-cols-5 w-full items-center-safe bg-cover bg-center  p-4 cursor-pointer active:px-20 overflow-hidden hover:pl-10 transition-all duration-300 ease-out`}
                  style={{ backgroundImage: `url(${product.image_url})` }}
                >
                  {/* Overlay with blur */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
                  {/* -------------------------- */}
                  {/* Product Image */}
                  {/* -------------------------- */}
                  <img
                    src={product.image_url || NoImage}
                    alt="Product image"
                    loading="lazy"
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
                </button>
              );
            })
          ) : ( keyword === null ?
            <div className="w-full text-center py-20 px-10 text-gray-400 font-bold">
              No product data of category type {selectedCategoryType} and category name {selectedCategoryName}
            </div>
            :
            <div className="w-full text-center py-20 px-10 text-gray-400 font-bold">
              Product name "{keyword}" not found
            </div>
          )}
        </>
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

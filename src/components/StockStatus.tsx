// components/StockStatus.tsx
//
import { Layers2 } from "lucide-react";
import type {
  Product,
  PRODUCT_STOCK_STATUS,
  StockStatusResponse,
} from "../types/product";
import { useEffect, useState } from "react";
import { STOCK_STATUS_CONFIG } from "../types/stock-status";
import {
  getAllProductsStatus,
  updateStockStatus,
} from "../services/admin.service";
import { Ellipsis } from "lucide-react";
import { RotateCcw } from "lucide-react";
import UpdateStockStatus from "./UpdateStockStatus";
import type { Axios, AxiosResponse } from "axios";

export default function StockStatus() {
  const [product, setProduct] = useState<StockStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [refetchVersion, setRefetchVersion] = useState(0);

  //
  //
  // Fetching Data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllProductsStatus({ page, size });
        setProduct(response);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }

      setIsLoading(false);
      setIsError(false);
    }
    fetchData();
  }, [refetchVersion, page, size]);

  //Force re-fetch even if page is already 1
  function handleRetry() {
    setPage(1); // Reset to first page
    setRefetchVersion((v) => v + 1);
  }

  //
  //
  //
  //
  // Pagination logic
  const currentPage = product?.pagination.page ?? page;
  const totalPages = product?.pagination.total_pages ?? 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  //
  function handlePrev() {
    if (hasPrev) {
      setPage((p) => p - 1);
    }
  }
  //
  function handleNext() {
    if (hasNext) {
      setPage((p) => p + 1);
    }
  }
  //
  function handlePageClick(pageNum: number) {
    setPage(pageNum);
  }
  //
  //
  // Get page numbers for pagination list down
  function getPageNumbers() {
    const pages: (number | string)[] = [];
    //
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // This block to be executed unless the Total Pages > 5
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    //
    return pages;
  }
  //
  //
  //
  //
  //
  // Update Stock Status Logic
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  async function handleUpdateStockStatus(
    productId: string,
    newStatus: PRODUCT_STOCK_STATUS,
  ) : Promise<number | null> {
    // call api
    try {
      const response = await updateStockStatus({ productId, newStatus });
      return response.status;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //
  //
  //
  //
  //
  //
  return (
    <>
      <section className="w-full bg-background-secondary text-text-primary rounded-lg mt-4 overflow-hidden border-border border-2">
        {/*  */}
        {/* Header of Stock Status Board */}
        {/* Stock Status Title */}
        <div className="w-full p-6 flex justify-between items-center bg-background-secondary-hover">
          <div className="flex gap-4">
            <Layers2 />
            <h3 className="font-semibold">Stoct Status</h3>
          </div>
          {/* Pages and Items */}
          {!isLoading && !isError && (
            <div>
              <h4 className="font-semibold text-xs text-text-secondary">
                Page {currentPage} of {totalPages}
              </h4>
              <h4 className="font-semibold text-sm">
                Total Items: {product?.pagination.total_items ?? 0}
              </h4>
            </div>
          )}
        </div>
        {/*  */}
        {/*  */}
        {/* Header of item columns | column name */}
        <div className="grid grid-cols-6 bg-sidebar text-text-secondary p-4 px-6 text-[10px] xl:text-sm font-bold uppercase">
          <h4 className="col-span-2">Item Name</h4>
          <h4>Category</h4>
          <h4>Current Stock</h4>
          <h4 className="w-full text-center">Status</h4>
          <h4 className="text-right w-full">Action</h4>
        </div>

        {/*  */}
        {/* Handle Loading */}
        {isLoading && (
          <div className="w-full py-8 flex justify-center items-center text-lg font-bold ">
            Loading product...
          </div>
        )}
        {/*  */}
        {/* Hanlde Error and Retry */}
        {isError && (
          <div className="w-full py-10 flex flex-col justify-center items-center gap-4">
            <p className="text-lg font-semibold text-red-400">
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
        {/*  */}
        {/* All items are being displayed here */}
        {/* Display list of products */}
        {product?.products.map((p) => {
          const config = STOCK_STATUS_CONFIG[p.status];
          return (
            <div
              key={p.id}
              className="grid grid-cols-6 items-center px-6 py-4 text-xs xl:text-base border-t border-border hover:bg-background-secondary-hover"
            >
              {/*  */}
              {/* Product Name Label*/}
              <h4 className="col-span-2 font-bold ">{p.name}</h4>
              {/*  */}
              {/* Catogory Label*/}
              <div className="h-full flex flex-col justify-center">
                <h5 className="text-[10px] xl:text-xs uppercase">
                  {p.category_type}
                </h5>
                <h5 className="font-semibold">{p.category_name}</h5>
              </div>
              {/*  */}
              {/* Current Stock Label */}
              <h4 className="font-bold">Comming soon</h4>
              {/*  */}
              {/* Stock Status Label */}
              <div
                className={`${config.colorClass} justify-self-center inline-block py-1 px-3 rounded-sm`}
              >
                <h4 className="font-bold text-white text-center uppercase">
                  {config.label}
                </h4>
              </div>
              {/*  */}
              {/* Update Stock Status Button */}
              <button
                onClick={() => setSelectedProduct(p)}
                className="py-1 px-3 lg:px-6 bg-green-600 text-white font-bold rounded-sm justify-self-end cursor-pointer hover:scale-110 active:scale-90 focus:outline-none transition-all duration-300 ease-out"
              >
                Restock
              </button>
            </div>
          );
        })}

        {/* Footer of the Stock Status Board */}
        {/* The bottom of the Stock Status board */}
        {/* Pagination */}
        <div className="flex justify-between px-6 py-4 border-t-4 border-border">
          {/* PREV */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
          >
            Prev
          </button>
          {/* 1 2 3 ... 4 */}
          {/* Page Numbers */}
          <div className="flex items-center justify-center gap-2">
            {getPageNumbers().map((pageNum, idx) =>
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
          {/*  */}
          {/* NEXT */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`${hasNext ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"} font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
          >
            Next
          </button>
        </div>

        {/*  */}
      </section>

      {/*  */}
      {/*  */}
      {/* Render Update Stock Status Model outside the section */}
      {selectedProduct && (
        <UpdateStockStatus
          product={selectedProduct}
          isOpen={true}
          onClose={() => {setSelectedProduct(null); document.body.classList.remove("overflow-hidden");}}
          onUpdate={handleUpdateStockStatus}
        />
      )}
    </>
  );
}
//
//
//
//

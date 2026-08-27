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

  const { selectedCategoryName, selectedCategoryType, keyword } =
    useProductFilter();

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
      {/* -----------------------------------
                      *
                      Header
                      *
        ------------------------------------ */}
      <header>
        {/* Icon & Pagination Info */}
        <div className="w-full p-6 flex flex-col gap-4 justify-between items-start bg-background-secondary-hover">
          <div className="flex gap-4 items-center ">
            <SquareChartGantt />
            <h3 className="font-semibold text-lg text-nowrap">
              Employee Profiles
            </h3>
          </div>
          {/*  */}
          {/* Pages and Items */}
          {!isLoading && !isError && (
            <div className="w-full flex justify-between items-center gap-4">
              <div>
                <h4 className="font-semibold text-xs text-text-secondary">
                  Page {currentPage} of {totalPages}
                </h4>
                <h4 className="font-semibold text-sm">
                  Profiles: {totalItems}
                </h4>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 text-sm flex items-center gap-2 font-semibold bg-background-secondary rounded-lg cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none"
              >
                {isRefetching ? (
                  "Syncing..."
                ) : (
                  <>
                    Refresh <RotateCcw size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* --------------------------------------------
                    Handle Loading 
      --------------------------------------------- */}
      {isLoading && !isError && (
        <div className="w-full py-20 flex justify-center items-center text-xl font-bold ">
          <TextLoader text="Loading..." />
        </div>
      )}

      {/* --------------------------------------------
                    Handle Error
      --------------------------------------------- */}
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

      {/* ------------------------------------------------
                        *
                        Display Items
                        *
      ------------------------------------------------- */}
      <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-1 gap-1">
        {!isLoading && !isError && (
          <>
            {products!.product_items?.length > 0 ? (
              products?.product_items?.map((product) => {
                const config = STOCK_STATUS_CONFIG[product.stock_status];
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`${product.id}`, { replace: true });
                    }}
                    className={` group relative cursor-pointer bg-cover bg-center overflow-hidden `}
                    // style={{ backgroundImage: `url(${product.image_url})` }}
                  >
                    {/* Background layer */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-out group-hover:scale-120 "
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    ></div>
                    {/* Overlay with blur */}
                    <div className="w-full h-full p-4 inset-0 bg-black/30 backdrop-blur-xl transition-all duration-300 ease-out">
                      {/* ----------------------------------------------
                                  image & price & cost
                      ----------------------------------------------- */}
                      <div className=" w-full grid grid-cols-2 gap-x-6">
                        <img
                          src={product.image_url || NoImage}
                          alt="product image"
                          loading="lazy"
                          className=" max-h-40 aspect-square object-center rounded-md"
                        />

                        {/* Price & Stock */}
                        <div className=" flex flex-col ">
                          <h5 className="text-start text-2xl md:text-xl lg:text-2xl font-bold text-green-400 text-nowrap">
                            Price ${product.price}
                          </h5>
                          <h5 className="text-start text-xl md:text-lg lg:text-xl font-bold ">
                            Cost ${product.cost_price}
                          </h5>
                          <h6
                            className={`mt-2 text-start font-bold w-fit inline-flex gap-2`}
                          >
                            <span className="font-semibold">Stock</span>
                            <span className={`${config.colorClass} px-4`}>
                              {config.label}
                            </span>
                          </h6>
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-bold text-2xl md:text-xl lg:text-2xl text-left py-2">
                        {product.name}
                      </h3>

                      {/* Category */}
                      <div className="w-full flex flex-col items-start gap-2">
                        <h5 className="font-bold text-sm bg-background-secondary-hover px-4 py-1">
                          {product.category_name}
                        </h5>
                        <h5 className="font-semibold text-sm">
                          {product.category_type}
                        </h5>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : keyword === null ? (
              <div className="w-full text-center py-20 px-10 text-gray-400 font-bold">
                No product data of category type {selectedCategoryType} and
                category name {selectedCategoryName}
              </div>
            ) : (
              <div className="w-full text-center py-20 px-10 text-gray-400 font-bold">
                Product name "{keyword}" not found
              </div>
            )}
          </>
        )}
      </main>

      {/* --------------------------------------------------------
                            *
                            Footer
                            *
      --------------------------------------------------------- */}
      <footer>
        <div className="flex bg-background-secondary-hover justify-between px-6 py-6 ">
          {/* ----------------------
                    Prev
          ----------------------- */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold px-4 py-2 rounded-md  bg-background-secondary  active:scale-90 transition-all duration-200 ease-out`}
          >
            Prev
          </button>
          {/* --------------------------------------------------
                            Number of pages
                            1 2 3 4 .......
          --------------------------------------------------- */}
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
          {/* ---------------------------
                      Next
          ---------------------------- */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`${hasNext ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"} font-semibold px-4 py-2 rounded-md  bg-background-secondary  active:scale-90 transition-all duration-200 ease-out`}
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}

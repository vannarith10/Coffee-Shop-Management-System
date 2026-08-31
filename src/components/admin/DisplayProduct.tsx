//
// components/DisplayProduct.tsx
//

import { useRef } from "react";
import NoImage from "../../assets/no-image.webp";
import { STOCK_STATUS_CONFIG } from "../../types/stock-status";
import { RotateCcw, SquareChartGantt } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextLoader from "../ui/TextLoader";
import { useAdminProduct } from "../../hooks/useAdminProduct";
import { useProductFilter } from "../../hooks/useProductFilter";
import PageHeader from "../ui/PageHeader";
import PageFooter from "../ui/PageFooter";

export default function DisplayProduct() {
  const size = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("productPage") || 1);

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

  const handlePrev = () => {
    if (!hasPrev) return;

    setSearchParams((prev) => {
      prev.set("productPage", String(page - 1));
      return prev;
    });
  };

  const handleNext = () => {
    if (!hasNext) return;

    setSearchParams((prev) => {
      prev.set("productPage", String(page + 1));
      return prev;
    });
  };

  const handlePageClick = (pageNum: number) => {
    setSearchParams((prev) => {
      prev.set("productPage", String(pageNum));
      return prev;
    });
  };

  const navigate = useNavigate();
  const targetRef = useRef<HTMLDivElement | null>(null);

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
      <PageHeader
        headerIcon={<SquareChartGantt />}
        headerTitle="Employee Profiles"
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        refetch={refetch}
        isRefetching={isRefetching}
      />

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
      {!isLoading && !isError && (
        <>
          {products!.product_items?.length > 0 ? (
            <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-1 gap-1">
              {products?.product_items?.map((product) => {
                const config = STOCK_STATUS_CONFIG[product.stock_status];
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`${product.id}`, { replace: true });
                    }}
                    className={` group relative cursor-pointer bg-cover bg-center overflow-hidden hover:scale-95 active:scale-80 transition-all duration-300 ease-out `}
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
                            <span className={`${config.bg} px-4`}>
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
              })}
            </main>
          ) : (
            <div className="w-full flex justify-center items-center py-20 font-bold">
              No data
            </div>
          )}
        </>
      )}

      {/* --------------------------------------------------------
                            *
                            Footer
                            *
      --------------------------------------------------------- */}
      <PageFooter
        handlePrev={handlePrev}
        handleNext={handleNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageClick={handlePageClick}
      />
    </section>
  );
}

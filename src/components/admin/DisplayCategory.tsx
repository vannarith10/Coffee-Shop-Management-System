//
// components/ListCategory.tsx
//
import { useEffect, useRef, useState } from "react";
import type { Category } from "../../types/category/category.ts";
import { SquarePen } from "lucide-react";
import EditCategory from "./EditCategory.tsx";
import TextLoader from "../ui/TextLoader.tsx";
import { ListSortAscending } from "lucide-react";
import { useCategory } from "../../hooks/useGetAllCategories.ts";
import { AnimatePresence } from "framer-motion";
import PageHeader from "../ui/PageHeader.tsx";
import PageFooter from "../ui/PageFooter.tsx";
import { useSearchParams } from "react-router-dom";

export default function ListCategory() {
  const size = 20;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("categoryPage") || 1);

  const {
    category,
    isLoading,
    isError,
    justUpdatedFieldId,
    justCreatedCategoryId,
    refetch,
    isRefetching,
  } = useCategory(page, size);

  const targetRef = useRef<HTMLDivElement | null>(null);

  const currentPage = category?.pagination.page ?? page;
  const totalPages = category?.pagination.total_pages ?? 1;
  const totalItems = category?.pagination.total_items ?? 0;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePrev = () => {
    if (!hasPrev) return;

    setSearchParams((prev) => {
      prev.set("categoryPage", String(page - 1));
      return prev;
    });
  };

  const handleNext = () => {
    if (!hasNext) return;

    setSearchParams((prev) => {
      prev.set("categoryPage", String(page + 1));
      return prev;
    });
  };

  const handlePageClick = (pageNum: number) => {
    setSearchParams((prev) => {
      prev.set("categoryPage", String(pageNum));
      return prev;
    });
  };

  // Select a category to open Form edit
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Scroll to the new Category that just created
  useEffect(() => {
    if (justCreatedCategoryId || justUpdatedFieldId) {
      targetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [justCreatedCategoryId, justUpdatedFieldId]);

  return (
    <>
      <section className="rounded-lg overflow-hidden border-2 border-border">
        {/* ======================== */}
        {/* HEADER */}
        {/* ======================== */}
        <PageHeader
          headerIcon={<ListSortAscending />}
          headerTitle="Category"
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          refetch={refetch}
          isRefetching={isRefetching}
        />

        {/* ====================== */}
        {/* Loading */}
        {/* ====================== */}
        {isLoading && !isError && (
          <div className="flex justify-center items-center w-full p-20 text-xl bg-background-secondary">
            <TextLoader text="Loading Categories..." />
          </div>
        )}

        {/* ------------------------------------------------------
                          *
                          Category items list
                          *
        ------------------------------------------------------- */}
        {!isLoading && !isError && category?.categories.length == 0 ? (
          <div className=" w-full flex justify-center items-center py-20 font-bold">
            No data
          </div>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-1 gap-1">
            {category?.categories?.map((category) => {
              const isActive = category.is_active;
              const justUpdated = category.category_id === justUpdatedFieldId;
              const justCreated =
                category.category_id === justCreatedCategoryId;
              const disabled = !category.is_active;

              return (
                <div
                  key={category.category_id}
                  ref={justCreated || justUpdated ? targetRef : null}
                  className={`flex flex-col gap-4 ${justUpdated || justCreated ? "bg-green-700" : disabled ? "bg-red-500/50" : "bg-background-secondary hover:bg-background-secondary-hover"} p-8 font-bold `}
                >
                  <div className="w-full flex justify-between items-center">
                    {/* Name */}
                    <h2 className="col-span-2 text-xl">
                      {category.category_name}
                    </h2>
                    {/* button edit */}
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className="px-2 py-1 text-white bg-sidebar/50 justify-self-end rounded-sm font-bold border border-border hover:border-border-hover cursor-pointer"
                    >
                      <SquarePen />
                    </button>
                  </div>
                  {/* Type */}
                  <h4
                    className={`text-xs md:text-sm w-fit inline-flex gap-4 items-center`}
                  >
                    <span className="text-white font-semibold ">Type</span>
                    <span
                      className={`${category.category_type === "DRINK" ? "bg-blue-500" : "bg-amber-500"} px-4 py-2 rounded-md`}
                    >
                      {category.category_type}
                    </span>
                  </h4>
                  {/* Status */}
                  <h4
                    className={` w-fit text-xs md:text-sm inline-flex gap-4 items-center`}
                  >
                    <span className="text-white font-semibold ">Status</span>
                    <span
                      className={`bg-background-primary/30 px-4 py-2 rounded-md ${isActive ? "text-green-600" : "text-amber-600"}`}
                    >
                      {isActive ? "ENABLED" : "DISABLED"}
                    </span>
                  </h4>
                </div>
              );
            })}{" "}
          </main>
        )}

        {/* ----------------------------------------

                           Footer 

        ------------------------------------------*/}
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

      {/* =============================== */}
      {/* To Open Form Edit */}
      {/* =============================== */}
      <AnimatePresence>
        {selectedCategory && (
          <EditCategory
            category={selectedCategory}
            isOpen={true}
            onClose={() => {
              setSelectedCategory(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

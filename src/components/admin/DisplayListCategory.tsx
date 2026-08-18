// components/ListCategory.tsx
//

import { useEffect, useRef, useState } from "react";
import type { Category } from "../../types/category.ts";
import { Ellipsis, SquarePen } from "lucide-react";
import EditCategory from "./EditCategory.tsx";
import TextLoader from "../ui/TextLoader.tsx";
import { ListSortAscending } from "lucide-react";
import { useCategory } from "../../hooks/useCategory.ts";
import { getPageNumbers } from "../../utils/page-numbers.ts";
import { AnimatePresence } from "framer-motion";

export default function ListCategory() {
  const [page, setPage] = useState(1);
  const size = 10;
  const {
    category,
    isLoading,
    isError,
    justUpdatedFieldId,
    justCreatedCategoryId,
  } = useCategory(page, size);

  const targetRef = useRef<HTMLDivElement | null>(null);

  const currentPage = category?.pagination.page ?? page;
  const totalPages = category?.pagination.total_pages ?? 1;
  const totalItems = category?.pagination.total_items ?? 0;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePrev = () => {
    if (hasPrev) setPage((p) => p - 1);
  };
  const handleNext = () => {
    if (hasNext) setPage((p) => p + 1);
  };
  function handlePageClick(pageNum: number) {
    setPage(pageNum);
  }

  // Select a category to open Form edit
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Scroll to the new Category that just created
  useEffect(() => {
    if (justCreatedCategoryId) {
      targetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [justCreatedCategoryId]);

  return (
    <>
      <section className="rounded-lg overflow-hidden border-2 border-border">
        {/* ======================== */}
        {/* HEADER */}
        {/* ======================== */}
        <header>
          {/* Icon & Pagination Info */}
          <div className="w-full p-6 flex justify-between items-center bg-background-secondary-hover">
            <div className="flex gap-4">
              <ListSortAscending />
              <h3 className="font-semibold">Category</h3>
            </div>
            {/*  */}
            {/* Pages and Items */}
            {!isLoading && !isError && (
              <div>
                <h4 className="font-semibold text-xs text-text-secondary">
                  Page {currentPage} of {totalPages}
                </h4>
                <h4 className="font-semibold text-sm">
                  Categories: {totalItems}
                </h4>
              </div>
            )}
          </div>
          {/*  */}
          {/* Colum Titles */}
          <div className="grid grid-cols-5 text-sm text-white font-bold bg-sidebar p-6">
            <h2 className="col-span-2">CATEGORY NAME</h2>
            <h2>TYPE</h2>
            <h2>STATUS</h2>
            <h2 className="text-end">ACTION</h2>
          </div>
        </header>

        {/* ====================== */}
        {/* Loading */}
        {/* ====================== */}
        {isLoading && !isError && (
          <div className="flex justify-center items-center w-full p-20 text-xl bg-background-secondary">
            <TextLoader text="Loading Categories..." />
          </div>
        )}

        {/* ============================ */}
        {/* Items List */}
        {/* ============================ */}
        {!isLoading &&
          category?.categories?.map((category) => {
            const isActive = category.is_active;
            const justUpdated = category.category_id === justUpdatedFieldId;
            const justCreated = category.category_id === justCreatedCategoryId;
            return (
              <main
                key={category.category_id}
                ref={justCreated ? targetRef : null}
                className={`grid grid-cols-5 items-center-safe text-sm ${justUpdated || justCreated ? "bg-green-700" : "bg-background-secondary hover:bg-background-secondary-hover"} p-8 font-bold border-t border-border`}
              >
                {/* Name */}
                <h2 className="col-span-2 text-lg">{category.category_name}</h2>
                {/* Type */}
                <h3
                  className={`${category.category_type === "DRINK" ? "bg-blue-500" : "bg-amber-500"} text-white inline-block justify-self-start px-2 md:px-4 rounded-sm py-1`}
                >
                  {category.category_type}
                </h3>
                {/* Status */}
                <h4
                  className={`${isActive ? "text-green-600" : "text-amber-600"} bg-background-primary/30 inline-block justify-self-start px-4 py-2 rounded-full font-bold text-xs lg:text-sm`}
                >
                  {isActive ? "ENABLED" : "DISABLED"}
                </h4>
                {/* ========================= */}
                {/* Action | Button */}
                {/* ========================= */}
                <button
                  onClick={() => setSelectedCategory(category)}
                  className="px-2 py-1 text-white bg-sidebar/50 justify-self-end rounded-sm font-bold border-2 border-border hover:border-border-hover cursor-pointer"
                >
                  <SquarePen />
                </button>
              </main>
            );
          })}
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

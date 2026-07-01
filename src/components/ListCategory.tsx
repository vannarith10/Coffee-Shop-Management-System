// components/ListCategory.tsx
//

import { useState } from "react";
import type { Category } from "../types/category";
import { SquarePen } from "lucide-react";
import EditCategory from "./EditCategory";
import TextLoader from "./ui/TextLoader";
import { ListSortAscending } from "lucide-react";
import { useCategory } from "../hooks/useCategory.ts";

export default function ListCategory() {
  const [page, setPage] = useState(1);
  const size = 20;
  // Receive data from custom hook
  const {
    category,
    isLoading,
    isError,
    justUpdatedFieldId,
  } = useCategory(page, size);
  // Select a category to open Form edit
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const totalItems = category?.pagination.total_items ?? 0;

  //
  //
  //
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
            return (
              <main
                key={category.category_id}
                className={`grid grid-cols-5 items-center-safe text-sm ${justUpdated ? "bg-green-700" : "bg-background-secondary hover:bg-background-secondary-hover"} p-8 font-bold border-t border-border`}
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
                {/* Action */}
                <button
                  onClick={() => setSelectedCategory(category)}
                  className="px-2 py-1 text-white bg-sidebar/50 justify-self-end rounded-sm font-bold border-2 border-border hover:border-border-hover cursor-pointer"
                >
                  <SquarePen />
                </button>
              </main>
            );
          })}
      </section>

      {/* =============================== */}
      {/* To Open Form Edit */}
      {/* =============================== */}
      {selectedCategory && (
        <EditCategory
          category={selectedCategory}
          isOpen={true}
          onClose={() => {
            setSelectedCategory(null);
            document.body.classList.remove("overflow-hidden");
          }}
        />
      )}
    </>
  );
}

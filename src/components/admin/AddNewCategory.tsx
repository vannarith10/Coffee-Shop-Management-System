// components/AddNewCategory.tsx
//

import { RotateCcw, SquarePlus, X } from "lucide-react";
import { useState } from "react";
import TextLoader from "../ui/TextLoader";
import {
  CATEGORY_TYPES_ARRAY,
  CategoryStatusOptions,
  type CATEGORY_STATUS,
  type CATEGORY_TYPE,
  type CreateCategoryRequest,
} from "../../types/category";
import { toast } from "sonner";
import { createCategory } from "../../services/admin.service";
import axios from "axios";
import { useCategoryStatusSummary } from "../../hooks/useCategoryStatusSummary";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../animation/FormHeader";

export default function AddNewCategory() {
  const { refetch, isRefetching } = useCategoryStatusSummary();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<CATEGORY_TYPE | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CATEGORY_STATUS | null>(
    null,
  );
  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  }
  //========================
  // on Close
  //========================
  function onClose() {
    setIsOpen(false);
    setSelectedType(null);
    setSelectedStatus(null);
    document.body.classList.remove("overflow-hidden");
  }

  //=========================
  // Submit
  //=========================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    if (selectedType === null) {
      toast.warning("Please select TYPE", { duration: 3000 });
      setIsLoading(false);
      return;
    }
    if (categoryName === null || categoryName.length == 0) {
      toast.warning("Please input NAME", { duration: 3000 });
      setIsLoading(false);
      return;
    }
    if (selectedStatus === null) {
      toast.warning("Please select STATUS", { duration: 3000 });
      setIsLoading(false);
      return;
    }

    const data: CreateCategoryRequest = {
      type: selectedType,
      name: categoryName,
      is_active: selectedStatus,
    };

    try {
      const res = await createCategory({ data: data });
      if (res.status == 201) onClose();
      //
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data as {
          message: string;
          status: number;
          timestamp: string;
          detail: string;
        };
        toast.error(errData?.detail ?? "Unexpected error");
      }

      setIsError(true);
      setIsError(true);
      //
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="w-full flex justify-end">
        <div className="w-full grid grid-cols-2 xl:grid-cols-4 gap-4">
          {/* ===================== */}
          {/* Button Add */}
          {/* ===================== */}
          <button
            onClick={() => setIsOpen(true)}
            className="col-start-1 xl:col-start-3 flex justify-center gap-2 items-center bg-background-secondary py-4 px-8 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
          >
            Add Category <SquarePlus />
          </button>
          {/* ------------------- */}
          {/* Refresh */}
          {/* ------------------- */}
          <button
            onClick={() => refetch()}
            className="col-start-2 xl:col-start-4 flex justify-center gap-2 items-center bg-background-secondary py-4 px-8 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
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
      </section>
      {/* ======================= */}
      {/* ======================= */}
      {/* Open Form */}
      {/* ======================= */}
      {/* ======================= */}
      <AnimatePresence>
        {isOpen && (
          <MyPopupForm onClose={onClose}>
            <form
              onSubmit={(e) => handleSubmit(e)}
              onClick={(e) => e.stopPropagation()}
              className="overflow-y-scroll scrollbar-hide w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] bg-background-primary rounded-4xl border-4 border-border flex flex-col gap-6 shimmer shimmer-bg shimmer-color-blue-300/30 shimmer-duration-9000"
            >
              {/* ----------------- */}
              {/* Form Title */}
              {/* ----------------- */}
              <FormHeader
                title="Create Category"
                onClose={onClose}
                className="w-full sticky top-0 z-100"
              />

              {/* ========================= */}
              {/* Category Types */}
              {/* ========================= */}
              <div className="flex flex-col gap-2 px-6">
                <label htmlFor="name" className="text-xs font-bold">
                  TYPE
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CATEGORY_TYPES_ARRAY.map((type) => {
                    const isSelected = type === selectedType;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        type="button"
                        className={`px-8 py-4 font-bold ${isSelected ? "bg-green-600" : "bg-background-secondary"} border-2 border-border rounded-md cursor-pointer hover:border-border-hover active:scale-90 transition-all duration-200 ease-out`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* ================================= */}
              {/* Name input*/}
              {/* ================================= */}
              <div className="flex flex-col w-full gap-2 px-6">
                <label htmlFor="name" className="text-xs font-bold">
                  NAME
                </label>
                <input
                  onChange={(e) => setCategoryName(e.target.value)}
                  type="text"
                  className="placeholder:text-sm placeholder:font-bold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
                />
              </div>

              {/* ============================ */}
              {/* Category Status */}
              {/* ============================ */}
              <div className="w-full flex flex-col gap-2 px-6">
                <label htmlFor="name" className="text-xs font-bold">
                  STATUS
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CategoryStatusOptions.map((status) => {
                    const isSelected = status.value === selectedStatus;
                    return (
                      <button
                        key={status.label}
                        onClick={() => setSelectedStatus(status.value)}
                        type="button"
                        className={`${isSelected ? "bg-green-600" : "bg-background-secondary"} px-8 py-4 font-bold border-2 border-border rounded-md cursor-pointer hover:border-border-hover active:scale-90 transition-all duration-200 ease-out`}
                      >
                        {status.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ========================= */}
              {/* Buttons | Cancel | Submit*/}
              {/* ========================= */}
              <div className="w-full grid grid-cols-3 gap-6 p-6">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="bg-gray-600/50 text-sm lg:text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`col-span-2 ${isError ? "bg-amber-600" : "bg-green-600"} text-sm lg:text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out`}
                >
                  {isError ? (
                    "Try again"
                  ) : isLoading && !isError ? (
                    <TextLoader text="Submitting..." />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </MyPopupForm>
        )}
      </AnimatePresence>
    </>
  );
}

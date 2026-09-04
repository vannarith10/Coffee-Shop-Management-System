// ------------------------------
// components/AddNewCategory.tsx
// ------------------------------
import { RotateCcw, SquarePlus } from "lucide-react";
import { useState } from "react";
import {
  CATEGORY_TYPES_ARRAY,
  CategoryStatusOptions,
  type CATEGORY_STATUS,
  type CATEGORY_TYPE,
  type CreateCategoryRequest,
} from "../../types/category/category";
import { toast } from "sonner";
import { useCategoryStatusSummary } from "../../hooks/useCategoryStatusSummary";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../animation/FormHeader";
import { useCreateCategory } from "../../hooks/category/useCreateCategory";
import ButtonCancel from "../ui/ButtonCancel";
import ButtonSubmit from "../ui/ButtonSubmit";
import { useSearchParams } from "react-router-dom";

export default function AddNewCategory() {
  const { refetch, isRefetching } = useCategoryStatusSummary();
  const [selectedType, setSelectedType] = useState<CATEGORY_TYPE | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CATEGORY_STATUS | null>(
    null,
  );
  const { mutate: createCategory, isError, isPending } = useCreateCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isOpen = searchParams.get("create") === "true";

  const handleOpenForm = () => {
    setSearchParams((prev) => {
      prev.set("create", String(true));
      return prev;
    });
  };

  const handleCloseForm = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("create");
      return params;
    });
  };

  //========================
  // on Close
  //========================
  function onClose() {
    handleCloseForm();
    setSelectedType(null);
    setSelectedStatus(null);
    document.body.classList.remove("overflow-hidden");
  }

  //=========================
  // Submit
  //=========================
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryName || categoryName.trim().length === 0) {
      toast.warning("Please input category name", { duration: 3000 });
      return;
    }

    if (selectedType === null) {
      toast.warning("Please select category type", { duration: 3000 });
      return;
    }

    if (selectedStatus === null) {
      toast.warning("Please select category status", { duration: 3000 });
      return;
    }

    const data: CreateCategoryRequest = {
      type: selectedType,
      name: categoryName,
      is_active: selectedStatus,
    };

    createCategory(data, {
      onSuccess: () => {
        onClose();
      },

      onError: (error) => {
        toast.error(error.response?.data?.detail || "Unexpected error");
      },
    });
  }

  return (
    <>
      <section className="w-full flex justify-end">
        <div className="w-full grid grid-cols-2 xl:grid-cols-4 gap-4">
          {/* ===================== */}
          {/* Button Add */}
          {/* ===================== */}
          <button
            onClick={handleOpenForm}
            className=" col-start-1 xl:col-start-3 text-xs md:text-sm flex justify-center gap-2 items-center bg-background-secondary py-4 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
          >
            Add Category <SquarePlus className="size-6 md:size-8 lg:size-10" />
          </button>
          {/* ------------------- */}
          {/* Refresh */}
          {/* ------------------- */}
          <button
            onClick={() => refetch()}
            className="col-start-2 xl:col-start-4 text-xs md:text-sm flex justify-center gap-2 items-center bg-background-secondary py-4 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
          >
            {isRefetching ? (
              "Syncing..."
            ) : (
              <>
                Refresh <RotateCcw className="size-6 md:size-8 lg:size-10" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* -----------------------------------

                Open The Form 

      -------------------------------------*/}
      <AnimatePresence>
        {isOpen && (
          <MyPopupForm onClose={onClose} handleSubmit={handleSubmit}>
            {/* ----------------- */}
            {/* Form Title */}
            {/* ----------------- */}
            <FormHeader
              title="Create Category"
              onClose={onClose}
              className="w-full sticky top-0 z-100"
            />

            {/* --------------------------------------
                          Name input
            --------------------------------------- */}
            <div className="p-4 bg-background-secondary-hover rounded-xl flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-bold">
                NAME
              </label>
              <input
                onChange={(e) => setCategoryName(e.target.value)}
                type="text"
                className="placeholder:text-sm placeholder:font-bold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
              />
            </div>

            {/* -----------------------------------------
                            Type input
            ------------------------------------------ */}
            <div className="p-4 bg-background-secondary-hover rounded-xl flex flex-col gap-2">
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

            {/* ------------------------------------------
                          Status input
            ------------------------------------------- */}
            <div className="p-4 bg-background-secondary-hover rounded-xl flex flex-col gap-2">
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
                      className={`${isSelected ? status.bg : "bg-background-secondary"} px-8 py-4 font-bold border-2 border-border rounded-md cursor-pointer hover:border-border-hover active:scale-90 transition-all duration-200 ease-out`}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------
                        Cancel | Submit 
              ----------------------------------*/}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
              <ButtonCancel handelCancel={onClose} />

              <ButtonSubmit isError={isError} isPending={isPending} />
            </div>
          </MyPopupForm>
        )}
      </AnimatePresence>
    </>
  );
}

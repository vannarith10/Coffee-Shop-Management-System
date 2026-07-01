// components/EditCategory.tsx
//

import { useState } from "react";
import {
  CATEGORY_TYPES_ARRAY,
  CategoryStatusOptions,
  type Category,
  type CATEGORY_TYPE,
  type PatchCategoryRequest,
} from "../types/category";
import TextLoader from "./ui/TextLoader";
import { patchCategory } from "../services/admin.service";
import { toast } from "sonner";

interface EditCategory {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export default function EditCategory({
  isOpen,
  onClose,
  category,
}: EditCategory) {
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<CATEGORY_TYPE>(
    category.category_type,
  );
  const [isActive, setIsActive] = useState<boolean>(category.is_active);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    const data: PatchCategoryRequest = {
      new_name: categoryName === category.category_name ? null : categoryName,
      new_type: categoryType === category.category_type ? null : categoryType,
      new_status: isActive === category.is_active ? null : isActive,
    };
    const allNull = Object.values(data).every((value) => value === null);

    try {
      if (allNull) {
        toast.warning("Need at least one edited field to update", {
          duration: 3000,
        });
        return;
      }
      const res = await patchCategory({
        categoryId: category.category_id,
        data: data,
      });
      if (res.status == 200) onClose();
    } catch (error) {
      console.error(error);
      setIsError(true);
      toast.error("Error updating category", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;
  return (
    <section
      onClick={onClose}
      className="absolute inset-0 z-30 backdrop-blur-xs flex justify-center items-center transition-all duration-500 ease-out"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => handleSubmit(e)}
        className="w-[70vw] max-h-[70vh] flex flex-col gap-6 bg-background-secondary p-10 rounded-2xl border-2 border-border"
      >
        <h2 className="font-bold text-2xl">Edit Category</h2>
        <div className="flex flex-col gap-6">
          {/* ================================= */}
          {/* Name input*/}
          {/* ================================= */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              NAME
            </label>
            <input
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder={category.category_name}
              type="text"
              className="placeholder:text-sm placeholder:font-bold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          {/* ================================= */}
          {/* Category selection */}
          {/* ================================= */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              CATEGORY TYPE
            </label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value as CATEGORY_TYPE)}
              className="border-2 font-bold border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            >
              {CATEGORY_TYPES_ARRAY.map((type) => {
                return (
                  <option
                    key={type}
                    value={type}
                    className="bg-background-secondary"
                  >
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
          {/* ==================================== */}
          {/* STATUS | Dropdown selection */}
          {/* ==================================== */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              ACTIVE STATUS
            </label>
            <select
              value={String(isActive)}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className={`${isActive ? "text-white" : "text-text-error"} border-2 font-bold border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover`}
            >
              {CategoryStatusOptions.map((option) => {
                return (
                  <option
                    key={String(option.value)}
                    value={String(option.value)}
                    className="bg-background-secondary text-text-primary"
                  >
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {/* ================================ */}
        {/* Buttons */}
        {/* Submit */}
        {/* ================================ */}
        <div className="w-full grid grid-cols-3 gap-6 pt-6">
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
    </section>
  );
}

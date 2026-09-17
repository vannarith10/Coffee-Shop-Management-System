import { useEffect, useState } from "react";
import { CategoryStatusOptions } from "@/features/categories/types/category";
import type { CategoryType } from "@/features/categories/types/enums";
import { type PatchCategoryRequest } from "@/features/categories/types/category";
import { CATEGORY_ARRAY } from "@/features/categories/types/enums";
import { toast } from "sonner";
import MyPopupForm from "../../../components/animation/MyPopupForm";
import {
  FormHeader,
  ButtonCancel,
  ButtonSubmit,
  CustomSelect,
} from "@/components/ui";
import { useUpdateCategory } from "../../categories/hooks/useUpdateCategory";
import { useSearchParams } from "react-router-dom";
import { useGetCategoryById } from "../../categories/hooks/useGetCategoryById";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditCategory({ isOpen, onClose }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id") ?? "";

  useEffect(() => {
    if (!id.trim()) {
      onClose();
    }
  }, [id, onClose]);

  const { data: category } = useGetCategoryById(id);

  const [currentName, setCurrentName] = useState<string>();
  const [currentType, setCurrentType] = useState<CategoryType>();
  const [currentStatus, setCurrentStatus] = useState<boolean>();

  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryType, setCategoryType] = useState<CategoryType | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      (() => {
        setCurrentName(category.category_name);
        setCurrentType(category.category_type);
        setCurrentStatus(category.is_active);
        //
        setCategoryName(category.category_name);
        setCategoryType(category.category_type);
        setIsActive(category.is_active);
      })();
    }
  }, [category]);

  const { mutate: updateCategory, isPending, isError } = useUpdateCategory();

  //=======================
  //
  // Submit
  //
  //=======================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data: PatchCategoryRequest = {
      new_name: categoryName === currentName ? null : categoryName,
      new_type: categoryType === currentType ? null : categoryType,
      new_status: isActive === currentStatus ? null : isActive,
    };

    const allNull = Object.values(data).every((value) => value === null);

    if (allNull) {
      toast.warning("Need at least one edited field to update", {
        duration: 3000,
      });
      return;
    }

    updateCategory(
      { id, new_data: data },
      {
        onError: (error) => {
          toast.error(error.response?.data.detail);
        },

        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  if (!isOpen) return null;
  return (
    <MyPopupForm onClose={onClose} handleSubmit={handleSubmit}>
      {/* ----------------- */}
      {/* Form Title */}
      {/* ----------------- */}
      <FormHeader
        title="Edit Category"
        onClose={onClose}
        className="w-full sticky top-0 z-100"
      />
      <div className="w-full h-full flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-4">
          {/* ================================= */}
          {/* Name input*/}
          {/* ================================= */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              NAME
            </label>
            <input
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder={currentName}
              type="text"
              className="placeholder:text-sm placeholder:font-bold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* -------------------------------------------
                            Type selection
              -------------------------------------------- */}
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="name" className="text-xs font-bold">
                CATEGORY TYPE
              </label>
              <CustomSelect
                value={categoryType}
                options={CATEGORY_ARRAY.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onChange={setCategoryType}
              />
            </div>
            {/* -------------------------------------------
                            Status selection
              -------------------------------------------- */}
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="name" className="text-xs font-bold">
                ACTIVE STATUS
              </label>
              <CustomSelect
                value={isActive}
                options={CategoryStatusOptions}
                onChange={setIsActive}
              />
            </div>
          </div>
        </div>
        {/* ================================ */}
        {/* Buttons */}
        {/* Submit */}
        {/* ================================ */}
        <div className="w-full grid grid-cols-3 gap-2 ">
          <ButtonCancel handelCancel={onClose} />
          <ButtonSubmit isError={isError} isPending={isPending} />
        </div>
      </div>
    </MyPopupForm>
  );
}

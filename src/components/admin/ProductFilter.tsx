import { useEffect, useState } from "react";
import { useGetAllCategoryNames } from "../../hooks/useGetAllCategoryNames";
import { useProductFilter } from "../../hooks/useProductFilter";
import { Delete, Search } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { motion } from "framer-motion";

const filters: { value: ProductFilter; background_color: string }[] = [
  {
    value: "ALL",
    background_color: "bg-green-600",
  },
  {
    value: "FOOD",
    background_color: "bg-amber-600",
  },
  {
    value: "DRINK",
    background_color: "bg-blue-600",
  },
];

type ProductFilter = "ALL" | "FOOD" | "DRINK";

export default function ProductFilter() {
  const { categoryNameType } = useGetAllCategoryNames();
  const [isFocusing, setIsFocusing] = useState(false);
  const {
    selectedCategoryType,
    selectedCategoryName,
    keyword,
    setSelectedCategoryType,
    setSelectedCategoryName,
    setKeyword,
  } = useProductFilter();
  const [inputValue, setInputValue] = useState(keyword ?? "");
  const debouncedKeyword = useDebounce(inputValue, 500);

  const filteredCategory =
    categoryNameType?.filter((c) => c.category_type === selectedCategoryType) ??
    [];

  // =====================================
  // Debounce handles setKeyword
  // handle send request when user stops typing
  // =====================================
  useEffect(() => {
    setKeyword(debouncedKeyword);
  }, [debouncedKeyword, setKeyword]);

  // ===================================================================
  // Clear 'selectedCategoryName' when searching product by input name
  // ===================================================================
  useEffect(() => {
    if (inputValue) {
      setSelectedCategoryName(null);
    }
  }, [setSelectedCategoryName, inputValue]);

  //========================================================================================
  // Clear 'selectedCategoryName', 'keyword', and 'inputValue' when we switch category type
  //========================================================================================
  useEffect(() => {
    (function reset() {
      setSelectedCategoryName(null);
      setKeyword(null);
      setInputValue("");
    })();
  }, [selectedCategoryType, setSelectedCategoryName, setKeyword]);

  return (
    <section className="w-full flex flex-col gap-4">
      {/* ======================================= */}
      {/* Category types */}
      {/* ======================================= */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="grid grid-cols-3 lg:flex gap-4">
          {filters.map((filter, idx) => {
            const isSelected = filter.value === selectedCategoryType;
            return (
              <motion.button
                key={filter.value}
                initial={{ opacity: 0, scale: 0.8, y: -20, }}
                animate={{ opacity: 1, scale: 1, y: 0, }}
                transition={{
                  type: "spring",
                  duration: 1,
                  stiffness: 300,
                  damping: 9,
                  delay: idx * 0.05,
                }}
                onClick={() => setSelectedCategoryType(filter.value)}
                className={`md:px-8 py-4 ${isSelected ? filter.background_color : "bg-background-secondary hover:bg-background-secondary-hover"} rounded-md font-bold cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none`}
              >
                {filter.value}
              </motion.button>
            );
          })}
        </div>
        {/* ------------------------------------------- */}
        {/* Search | Text box */}
        {/* ------------------------------------------- */}
        <div
          className={`${isFocusing && "border-green-600"} w-full flex items-center p-4 gap-4 border-2 border-border rounded-md`}
        >
          <Search />
          <input
            type="text"
            placeholder="Search product name"
            value={inputValue}
            onFocus={() => setIsFocusing(true)}
            onBlur={() => setIsFocusing(false)}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full font-semibold rounded-md outline-none placeholder:text-gray-500`}
          />
          <button
            onClick={() => {
              setKeyword(null);
              setInputValue("");
            }}
            className={`${inputValue !== "" ? "rotate-0 hover:text-text-error cursor-pointer active:scale-150" : "rotate-180"} outline-none transition-all duration-500 ease-out`}
          >
            <Delete />
          </button>
        </div>
      </div>

      {/* =========================================== */}
      {/* Category names */}
      {/* =========================================== */}
      {filteredCategory.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {filteredCategory.map((cate, idx) => {
            const isSelected = cate.category_name === selectedCategoryName;
            return (
              <motion.button
                key={cate.category_id}
                initial={{ opacity: 0, scale: 0.8, y: -20, }}
                animate={{ opacity: 1, scale: 1, y: 0, }}
                transition={{
                  type: "spring",
                  duration: 1,
                  stiffness: 300,
                  damping: 9,
                  delay: idx * 0.05,
                }}
                disabled={inputValue !== ""}
                onClick={() =>
                  setSelectedCategoryName(
                    cate.category_name === selectedCategoryName
                      ? null
                      : cate.category_name,
                  )
                }
                className={`px-8 py-2 font-mono font-bold text-sm  ${isSelected ? filters.find((f) => f.value === selectedCategoryType)?.background_color : "bg-background-secondary hover:bg-background-secondary-hover"} outline-none rounded-md ${inputValue !== "" ? "cursor-not-allowed bg-background-secondary/30" : "cursor-pointer active:scale-80"}  transition-all duration-200 ease-out`}
              >
                {cate.category_name}
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
}

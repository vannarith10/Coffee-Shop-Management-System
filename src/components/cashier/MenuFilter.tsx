//
//  components/cashier/MenuFilter.tsx
//
import { useEffect, useState } from "react";
import { useGetAllCategoryNames } from "../../hooks/useGetAllCategoryNames";
import { useProductFilter } from "../../hooks/useProductFilter";
import { motion } from "framer-motion";
import SearchBox from "../ui/SearchBox";
import { useDebounce } from "../../hooks/useDebounce";

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

const MenuFilter = () => {
  const { categoryNameType, isLoadingCategoryNames, isErrorCategoryNames } =
    useGetAllCategoryNames();
  const {
    keyword,
    setKeyword,
    selectedCategoryType,
    selectedCategoryName,
    setSelectedCategoryType,
    setSelectedCategoryName,
  } = useProductFilter();

  // const { keyword, setKeyword } = useProductFilter();
  const [inputValue, setInputValue] = useState(keyword ?? "");
  const debouncedKeyword = useDebounce(inputValue, 500);

  //=====================================================================
  // Clear 'selectedCategoryName', 'keyword' when we switch category type
  //=====================================================================
  useEffect(() => {
    (() => {
      setSelectedCategoryName(null);
      setKeyword("");
    })();
  }, [
    selectedCategoryType,
    setSelectedCategoryName,
    setKeyword,
    categoryNameType,
  ]);

  // =====================================
  // Debounce handles setKeyword
  // handle send request when user stops typing
  // =====================================
  useEffect(() => {
    // setKeyword gets value from debouncedKeyword, and debouncedKeyword gets from inputValue
    setKeyword(debouncedKeyword);
  }, [debouncedKeyword, setKeyword]);

  // When filtering, we set keyword to "" empty string
  // but the input box still showing the text
  // so this block will clear that text
  // Finally, if "keywork" = empty then text box will be empty too
  useEffect(() => {
    (() => {
      if (keyword == "" || keyword == null) {
        setInputValue("");
      }
    })();
  }, [keyword]);

  // Handle set input value
  function handleInputOnChange(value: string) {
    setInputValue(value);
  }

  // Handle clear input
  function handleClearInput() {
    setKeyword(null);
    setInputValue("");
  }

  const filteredCategory =
    categoryNameType?.filter((c) => c.category_type === selectedCategoryType) ??
    [];

  // =======================================================
  // Handle Error and Loading
  // =======================================================
  if (isErrorCategoryNames || isLoadingCategoryNames) return;

  return (
    <section className="w-full flex flex-col p-4 gap-4">
      <SearchBox
        value={inputValue}
        onChange={handleInputOnChange}
        onClear={handleClearInput}
      />
      {/* ======================================= */}
      {/* Category types */}
      {/* ======================================= */}
      <div className="flex flex-col gap-4 ">
        <div className="grid grid-cols-3 gap-4">
          {filters.map((filter, idx) => {
            const isSelected = filter.value === selectedCategoryType;
            return (
              <motion.button
                key={filter.value}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                onClick={() => setSelectedCategoryType(filter.value)}
                className={` lg:px-7 py-4 ${isSelected ? filter.background_color : "bg-background-secondary hover:bg-background-secondary-hover"} rounded-md font-bold cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none`}
              >
                {filter.value}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* =========================================== */}
      {/* Category names */}
      {/* display category names under category types */}
      {/* =========================================== */}
      {filteredCategory.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {filteredCategory.map((cate, idx) => {
            const isSelected = cate.category_name === selectedCategoryName;
            return (
              <motion.button
                key={cate.category_id}
                initial={{ opacity: 0, scale: 0.8, y: -20, x: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                transition={{
                  type: "spring",
                  duration: 1,
                  stiffness: 300,
                  damping: 9,
                  delay: idx * 0.05,
                }}
                disabled={keyword !== ""}
                onClick={() =>
                  setSelectedCategoryName(
                    cate.category_name === selectedCategoryName
                      ? null
                      : cate.category_name,
                  )
                }
                className={`px-8 py-2 font-mono font-bold text-sm  ${isSelected ? filters.find((f) => f.value === selectedCategoryType)?.background_color : "bg-background-secondary hover:bg-background-secondary-hover"} outline-none rounded-md ${keyword !== "" ? "cursor-not-allowed bg-background-secondary/30" : "cursor-pointer active:scale-80"}  transition-all duration-200 ease-out`}
              >
                {cate.category_name}
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MenuFilter;

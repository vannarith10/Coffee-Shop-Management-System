// components/ListCategory.tsx
//

import { useEffect, useMemo, useState } from "react";
import { getAllCategories } from "../services/admin.service";
import type { Category, GetAllCategoriesResponse } from "../types/category";
import { SquarePen } from "lucide-react";
import EditCategory from "./EditCategory";
import TextLoader from "./ui/TextLoader";
import { toast } from "sonner";
import { updateCategory } from "../utils/data-cache-update";
import { useCategoryUpdate } from "../hooks/useCategoryUpdate";

export default function ListCategory() {
  const [page, setPage] = useState(1);
  const size = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageCache, setPageCache] = useState<
    Record<number, GetAllCategoriesResponse>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const category = useMemo(() => pageCache[page] ?? null, [pageCache, page]);

  useEffect(() => {
    if (pageCache[page]) {
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await getAllCategories({ page: page, size: size });
        setPageCache((prev) => ({ ...prev, [page]: res.data }));
      } catch (error) {
        console.error(error);
        setIsError(true);
        toast.error("Error loading categories", {duration: 3000});
      } finally {
        setTimeout(() => {setIsLoading(false)}, 1000)
      }
    }
    fetchData();
  }, [page, pageCache]);


  //===============================================
  // WebSocket | Custome Hook | Highlight field
  //===============================================
  const [justUpdatedFieldId, setJustUpdateFieldId] = useState<string | null>(null);
  useEffect(() => {
    setTimeout(() => {setJustUpdateFieldId(null)}, 3000)
  }, [justUpdatedFieldId]);
  //
  //
  function handleCategoryUpdate (category: Category) {
    setPageCache((prev) => updateCategory(prev, category))
    setJustUpdateFieldId(category.category_id);
  }
  useCategoryUpdate({onCategoryUpdate: handleCategoryUpdate});


  //
  //
  //
  return (
    <>
    <section className="rounded-lg overflow-hidden border-2 border-border">
      <header className="grid grid-cols-5 text-sm text-white font-bold bg-sidebar p-6">
        <h2 className="col-span-2">CATEGORY NAME</h2>
        <h2>TYPE</h2>
        <h2>STATUS</h2>
        <h2 className="text-end">ACTION</h2>
      </header>

      {isLoading && !isError && (
                <div className="flex justify-center items-center w-full p-20 text-xl bg-background-secondary">
                  <TextLoader text="Loading Categories..." />
                </div>)}

      {!isLoading && category?.categories?.map((category) => {
        const isActive = category.is_active;
        const justUpdated = category.category_id === justUpdatedFieldId;
        return (
          <main
            key={category.category_id}
            className={`grid grid-cols-5 items-center-safe text-sm ${justUpdated ? "bg-green-700" : "bg-background-secondary hover:bg-background-secondary-hover"} p-8 font-bold border-t border-border`}
          >
            <h2 className="col-span-2">{category.category_name}</h2>
            <h3 className={`${category.category_type === "DRINK" ? "bg-blue-500" : "bg-amber-500"} inline-block justify-self-start px-2 rounded-sm py-1`}>{category.category_type}</h3>
            <h4
              className={`${isActive ? "text-green-600" : "text-amber-600"} bg-background-primary inline-block justify-self-start px-4 py-2 rounded-full font-bold text-xs lg:text-sm`}
            >
              {isActive ? "ENABLED" : "DISABLED"}
            </h4>
            <button
              onClick={() => setSelectedCategory(category)}
              className="px-2 py-1 text-white bg-sidebar justify-self-end rounded-sm font-bold border-2 border-border hover:border-border-hover cursor-pointer"
            >
              <SquarePen />
            </button>
          </main>
        );
      })}
    </section>


      {/* Edit */}
    {selectedCategory && (<EditCategory category={selectedCategory} isOpen={true} onClose={() => {
            setSelectedCategory(null);
            document.body.classList.remove("overflow-hidden");
          }}/>)}
    </>
  );
}

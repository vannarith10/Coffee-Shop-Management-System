//
// pages/admin/CategoryTab.tsx
//
import AddNewCategory from "../../components/admin/AddNewCategory";
import CategoryStatus from "../../components/admin/CategoryStatusSummary";
import ListCategory from "../../components/admin/DisplayCategory";

export default function CategoryTab() {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl xl:text-4xl font-extrabold">
          Category Management
        </h1>
        <p className="text-sm text-text-secondary">
          Oversee and manage your categories.
        </p>
      </div>
      <AddNewCategory />
      <CategoryStatus />
      <ListCategory />
    </div>
  );
}

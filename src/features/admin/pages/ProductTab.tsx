import DisplayProduct from "@/features/admin/components/DisplayProduct";
import { Outlet } from "react-router-dom";
import AddNewProductForm from "@/features/admin/components/AddNewProductForm";
import ProductFilter from "@/features/admin/components/ProductFilter";
import ScrollToTheTop from "@/components/ScrollToTheTop";

const ProductTab = () => {
  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl xl:text-4xl font-extrabold">
          Product Management
        </h1>
        <p className="text-sm text-text-secondary">
          Organize, edit, and track your menu inventory.
        </p>
      </div>

      <ScrollToTheTop />
      <AddNewProductForm />
      <ProductFilter />
      <DisplayProduct />
      <Outlet />
    </div>
  );
};

export default ProductTab;

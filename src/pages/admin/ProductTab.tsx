import React from "react";
import DisplayProduct from "../../components/admin/DisplayProduct";
import { Outlet } from "react-router-dom";
import AddNewProductForm from "../../components/admin/AddNewProductForm";
import ProductFilter from "../../components/admin/ProductFilter";

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


      <AddNewProductForm/>
      <ProductFilter/>
      <DisplayProduct/>
      <Outlet/>
    </div>
  );
};

export default ProductTab;

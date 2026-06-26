// components/UpdateStockStatus.tsx
//

import { useState } from "react";
import type { Product } from "../types/product";
import type { PRODUCT_STOCK_STATUS } from "../types/product";
import { Layers2 } from 'lucide-react';
import { toast } from "sonner";

interface UpdateStockStatusProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (productId: string, newStatus: PRODUCT_STOCK_STATUS) => Promise<number | null>;
}

const STATUS_OPTIONS: {
  value: PRODUCT_STOCK_STATUS;
  label: string;
  description: string;
  accent: string;
  border: string;
  bg: string;
}[] = [
  {
    value: "IN_STOCK",
    label: "Normal",
    description: "Stock level is healthy",
    accent: "accent-green-600",
    border: "border-green-500",
    bg: "bg-background-secondary",
  },
  {
    value: "LOW_STOCK",
    label: "Low",
    description: "Stock is running low",
    accent: "accent-yellow-600",
    border: "border-yellow-500",
    bg: "bg-background-secondary",
  },
  {
    value: "OUT_OF_STOCK",
    label: "Out",
    description: "Out of stock",
    accent: "accent-red-600",
    border: "border-red-500",
    bg: "bg-background-secondary",
  },
];

export default function UpdateStockStatus({
  product,
  isOpen,
  onClose,
  onUpdate,
}: UpdateStockStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState<PRODUCT_STOCK_STATUS>(
    product.status,
  );

  // Disable scrolling
  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const statusCode = await onUpdate(product.id, selectedStatus);
    if (statusCode == 200) {
      toast.success("Stock updated successfully", {duration: 3000});
      onClose();
    } else {
      toast.error("Error updating stock", {duration: 3000});
    }
  }

  if (!isOpen) return null;

  return (
    <section className={`fixed inset-0 z-30 flex items-center justify-center`}>
      {/* Backdrop blur */}
      <div
        onClick={onClose}
        className="flex justify-center items-center absolute inset-0 bg-black/50 backdrop-blur-sm"
      >
        {/*  */}
        {/* Update Status Form */}
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col justify-between bg-background-primary/50 backdrop-blur-md border-border border-2 h-150 w-[80vw] md:w-[50vw] xl:w-[40vw] rounded-4xl p-8"
        >
          {/*  */}
          {/*  */}
          <div className="flex flex-col gap-6">
            {/* Form Header | Name & Icon */}
            <div className="flex flex-col items-center">
              <div className="bg-background-secondary p-4 rounded-lg mb-4">
                <Layers2 />
              </div>
              <h3 className="font-bold text-sm md:text-xl">Update Stock Status</h3>
              <h4 className="text-sm font-semibold text-yellow-500">{product.name}</h4>
            </div>
            {/*  */}
            {/* Stock Status Input Options */}
            {STATUS_OPTIONS.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  isSelected
                    ? `${option.border} ${option.bg}`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="stockStatus"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => setSelectedStatus(option.value)}
                  className={`w-4 h-4 ${option.accent}`}
                />
                <div>
                  <span className="font-semibold">
                    {option.label}
                  </span>
                  <p className="text-xs text-text-secondary">
                    {option.description}
                  </p>
                </div>
              </label>
              );
            })}
          </div>
          {/*  */}
          {/* Bottom Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onClose()}
              className="py-4 font-semibold bg-background-secondary/50 rounded-lg cursor-pointer hover:scale-105 active:scale-90 transition-all duration-200 ease-out"
            >
              Cancel
            </button>
            <button className="w-full font-semibold col-span-2 bg-sidebar/70 hover:bg-sidebar rounded-lg cursor-pointer hover:scale-105 active:scale-90 transition-all duration-200 ease-out">
              Update Status
            </button>
          </div>
        </form>
        {/*  */}
      </div>
    </section>
  );
}

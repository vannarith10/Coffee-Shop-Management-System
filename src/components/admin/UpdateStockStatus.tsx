//
// components/UpdateStockStatus.tsx
//

import { useState } from "react";
import type { ProductStock } from "../../types/product";
import type { PRODUCT_STOCK_STATUS } from "../../types/product";
import { Layers2 } from "lucide-react";
import { toast } from "sonner";
import { STATUS_OPTIONS, STOCK_STATUS_CONFIG } from "../../types/stock-status";
import TextLoader from "../ui/TextLoader";
import MyPopupForm from "../animation/MyPopupForm";
import { useUpdateStockStatus } from "../../hooks/stock/useUpdateStockStatus";
import ButtonCancel from "../ui/ButtonCancel";
import ButtonSubmit from "../ui/ButtonSubmit";

interface UpdateStockStatusProps {
  product: ProductStock;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateStockStatus({
  product,
  isOpen,
  onClose,
  // onUpdate,
}: UpdateStockStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState<PRODUCT_STOCK_STATUS>(
    product.status,
  );

  const {
    mutate: updateStockStatus,
    isError,
    isPending,
  } = useUpdateStockStatus();

  const config = STOCK_STATUS_CONFIG[product.status];

  //=====================
  // Handle Update
  //=====================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateStockStatus(
      { productId: product.id, newStatus: selectedStatus },
      {
        onError: (error) => {
          toast.error(error?.response?.data?.detail || error.message);
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
      {/* Form Header | Name & Icon */}
      <header className="flex flex-col items-center mt-10">
        <div className="bg-background-secondary-hover p-4 rounded-lg mb-4">
          <Layers2 />
        </div>
        <h3 className="font-bold text-sm md:text-xl">Update Stock Status</h3>
        <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500">
          {product.name}
        </h4>
        {/* Current stock */}
        <div className="flex gap-2 items-center justify-center mt-4">
          <h5 className="font-semibold text-xs sm:text-sm">Current stock:</h5>
          <span
            className={`text-sm text-white font-bold ${config.bg} px-4 py-2 rounded-xs`}
          >
            {config.label}
          </span>
        </div>
      </header>
      {/* --------------------------------------------------------
                    *
                    Status Input: IN / LOW / OUT
                    *
      -------------------------------------------------------- */}
      {STATUS_OPTIONS.map((option) => {
        const isSelected = selectedStatus === option.value;
        return (
          <label
            key={option.value}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all active:scale-90 duration-300 ease-out ${
              isSelected
                ? `${option.border} ${option.bg}`
                : "border-border hover:border-border-hover"
            }`}
          >
            <input
              type="radio"
              name="stockStatus"
              value={option.value}
              checked={isSelected}
              onChange={() => setSelectedStatus(option.value)}
              className={`w-4 h-4 ${option.accent} outline-none`}
            />
            <div>
              <span className="font-semibold uppercase">{option.label}</span>
              <p className="text-xs text-text-secondary">
                {option.description}
              </p>
            </div>
          </label>
        );
      })}

      {/* --------------------------------------------------------
                    *
                    Buttons: Cancel / Update
                    *
        -------------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-2">
        <ButtonCancel handelCancel={onClose} />
        <ButtonSubmit isError={isError} isPending={isPending} />
      </div>
    </MyPopupForm>
  );
}

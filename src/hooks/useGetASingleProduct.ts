// hooks/useGetASingleProduct.ts
//

import { useEffect, useState } from "react";
import { getASingleProduct } from "../services/admin.service";
import axios from "axios";
import { toast } from "sonner";
import type { Product } from "../types/product";
import { useAProductUpdate } from "./useAProductUpdate";

export function useGetASingleProduct({ id }: { id: string }) {
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getProduct() {
      try {
        setIsLoading(true);
        const res = await getASingleProduct({ id: id });
        setProduct(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errData = error.response?.data as {
            message: string;
            status: number;
            timestamp: string;
            detail: string;
          };
          toast.error(errData?.detail ?? "Unexpected error");
          setIsError(true);
        }
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    }

    getProduct();
  }, [id]);


  // WebSocket Update
  function handleProductUpdate(product: Product) {
    setProduct(product);
  }
  useAProductUpdate({ onProductUpdate: handleProductUpdate });

  return { product, isLoading, isError };
}

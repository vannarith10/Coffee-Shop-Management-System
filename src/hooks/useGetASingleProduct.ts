// hooks/useGetASingleProduct.ts
//

import { getASingleProduct } from "../services/admin/product";
import type { Product } from "../types/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetASingleProduct({ id }: { id: string }) {
  const queryKey = ["single-product", id];

  return useQuery<Product>({
    queryKey,
    queryFn: () => getASingleProduct({ id }).then((res) => res.data as Product),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

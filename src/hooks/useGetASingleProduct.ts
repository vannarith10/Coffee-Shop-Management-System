// hooks/useGetASingleProduct.ts
//

import { getASingleProduct } from "../services/admin/product";
import type { Product } from "../types/product";
import { useQuery } from "@tanstack/react-query";

export function useGetASingleProduct({ id }: { id: string }) {
  const queryKey = ["single-product", id];

  return useQuery<Product>({
    queryKey,
    queryFn: () => getASingleProduct({ id }).then((res) => res.data as Product),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

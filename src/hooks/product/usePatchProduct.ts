import { useMutation } from "@tanstack/react-query";
import { patchProduct } from "../../services/admin/product";
import type { UpdateProductRequest } from "../../types/product";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../../types/error";

interface PatchProductRequest {
  id: string;
  data: UpdateProductRequest;
  image?: File | null;
}

export function usePatchProduct() {
  return useMutation<void, AxiosError<BackendErrorDetail>, PatchProductRequest>({
    mutationFn: (request: PatchProductRequest) => patchProduct({ id: request.id, data: request.data, image: request.image }),
  });
}

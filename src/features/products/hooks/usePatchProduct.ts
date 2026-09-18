import { useMutation } from "@tanstack/react-query";
import { patchProduct } from "../services/product";
import type { UpdateProductRequest } from "../types/product";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types/common";

interface PatchProductRequest {
  id: string;
  data: UpdateProductRequest;
  image?: File | null;
}

export function usePatchProduct() {
  return useMutation<
    void,
    AxiosError<BackendErrorDetailType>,
    PatchProductRequest
  >({
    mutationFn: (request: PatchProductRequest) =>
      patchProduct({
        id: request.id,
        data: request.data,
        image: request.image,
      }),
  });
}

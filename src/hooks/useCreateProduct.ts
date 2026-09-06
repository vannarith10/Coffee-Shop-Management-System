import { useMutation } from "@tanstack/react-query";
import type { AddNewProductRequest } from "../types/product";
import { addNewProduct } from "../services/admin/product";
import { AxiosError } from "axios";
import type { BackendErrorDetail } from "../types/error";

type CreateProductRequest = {
  data: AddNewProductRequest;
  image: File;
};

export function useCreateProduct() {
  return useMutation<void, AxiosError<BackendErrorDetail>, CreateProductRequest >({
    mutationFn: ({ data, image }: CreateProductRequest) =>
      addNewProduct({ data, image }),
  });
}

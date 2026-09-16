import { useMutation } from "@tanstack/react-query";
import type { AddNewProductRequest } from "../types/product";
import { addNewProduct } from "../services/product";
import { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types";

type CreateProductRequest = {
  data: AddNewProductRequest;
  image: File;
};

export function useCreateProduct() {
  return useMutation<
    void,
    AxiosError<BackendErrorDetailType>,
    CreateProductRequest
  >({
    mutationFn: ({ data, image }: CreateProductRequest) =>
      addNewProduct({ data, image }),
  });
}

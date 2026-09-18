import { useMutation } from "@tanstack/react-query";
import type { BackendErrorDetailType } from "@/types/common";
import type { AxiosError } from "axios";
import { createCategory } from "../services/category";
import type { CreateCategoryRequest } from "../types/category";

export function useCreateCategory() {
  return useMutation<
    void,
    AxiosError<BackendErrorDetailType>,
    CreateCategoryRequest
  >({
    mutationFn: (data: CreateCategoryRequest) => createCategory({ data }),
  });
}

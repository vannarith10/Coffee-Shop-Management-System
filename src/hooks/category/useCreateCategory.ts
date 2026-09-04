import { useMutation } from "@tanstack/react-query";
import type { BackendErrorDetail } from "../../types/error";
import type { AxiosError } from "axios";
import { createCategory } from "../../services/admin/category";
import type { CreateCategoryRequest } from "../../types/category/category";

export function useCreateCategory() {
  return useMutation<
    void,
    AxiosError<BackendErrorDetail>,
    CreateCategoryRequest
  >({
    mutationFn: (data: CreateCategoryRequest) => createCategory({ data }),
  });
}

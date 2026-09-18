import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types/common";
import type { PatchCategoryRequest } from "../types/category";
import { patchCategory } from "../services/category";

type Request = {
  id: string;
  new_data: PatchCategoryRequest;
};

export function useUpdateCategory() {
  return useMutation<void, AxiosError<BackendErrorDetailType>, Request>({
    mutationFn: (Request) =>
      patchCategory({ categoryId: Request.id, data: Request.new_data }),
  });
}

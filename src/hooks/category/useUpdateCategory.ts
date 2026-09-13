//
//  Patch Category
//
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "@/types";
import type { PatchCategoryRequest } from "@/types";
import { patchCategory } from "../../services/admin/category";

type Request = {
  id: string;
  new_data: PatchCategoryRequest;
};

export function useUpdateCategory() {
  return useMutation<void, AxiosError<BackendErrorDetail>, Request>({
    mutationFn: (Request) =>
      patchCategory({ categoryId: Request.id, data: Request.new_data }),
  });
}

import { useMutation } from "@tanstack/react-query";
import type { AddNewProductRequest } from "../types/product";
import { addNewProduct } from "../services/admin.service";
import { toast } from "sonner";
import axios from "axios";
import type { BackendErrorDetail } from "../types/error";

type CreateProductPayload = {
  data: AddNewProductRequest;
  image: File;
};

export function useCreateProduct(onAction?: () => void) {
  return useMutation({
    mutationFn: ({ data, image }: CreateProductPayload) =>
      addNewProduct({ data, image }),

    onSuccess: (res) => {
      if (res.status === 201) {
        toast.success("Product created", { duration: 3000 });
      }

      onAction?.(); // Optional chaining, it is like this statement: if(onAction){onAction();}
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as BackendErrorDetail;
        toast.error(errorData?.detail ?? "Unexpected error");
      }
    },
  });
}

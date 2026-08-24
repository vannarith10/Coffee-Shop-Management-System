// hooks/useDeleteShopLogo.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShopLogo } from "../services/admin/shop";
import { type BackendErrorDetail } from "../types/error";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export function useDeleteShopLogo() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<BackendErrorDetail>>({
    mutationFn: deleteShopLogo,

    // Refresh shop logo
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-name-and-logo"],
      });
      toast.info("Shop logo has been removed", {duration: 5000});
    },

    onError: (error) => {
        toast.error(error.response?.data?.detail ?? "Failed to remove shop logo", {duration: 5000});
    }
  });
}

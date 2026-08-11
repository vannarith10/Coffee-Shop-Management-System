// hooks/useUpdateShopLogo.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShopLogo } from "../services/admin.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../types/error";
import type { ShopLogoUpdateResponse } from "../types/shop-setting";

export function useUpdateShopLogo() {
  const queryClient = useQueryClient();

  return useMutation<
    ShopLogoUpdateResponse,
    AxiosError<BackendErrorDetail>,
    File
  >({
    mutationFn: (image) => updateShopLogo(image),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-name-and-logo"],
      });
      toast.success("Shop logo updated successfully", {duration: 3000});
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.detail ?? "Failed to update shop logo",
        { duration: 3000 },
      );
    },
  });
}

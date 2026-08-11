// hooks/useUpdateShopInfo.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShopInfo } from "../services/admin.service";
import type { UpdateShopInfoRequest } from "../types/shop-setting";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../types/error";
import { toast } from "sonner";

export function useUpdateShopInfo() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<BackendErrorDetail>,
    UpdateShopInfoRequest
  >({
    mutationFn: (data) => updateShopInfo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-info"],
      });
      queryClient.invalidateQueries({
        queryKey: ["shop-name-and-logo"],
      });
      toast.success("Shop Profile updated", { duration: 5000 });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.detail ?? "Failed to update shop profile",
        { duration: 5000 },
      );
    },
  });
}

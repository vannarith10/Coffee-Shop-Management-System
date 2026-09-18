import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShopInfo } from "../services/shop";
import type { AxiosError } from "axios";
import type { UpdateShopInfoRequest } from "../types/shop";
import { type BackendErrorDetailType } from "../../../types/common";
import { toast } from "sonner";

export function useUpdateShopInfo() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<BackendErrorDetailType>,
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

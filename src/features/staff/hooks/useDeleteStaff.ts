import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types";
import { deleteProfile } from "../services/staff";
import { toast } from "sonner";

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<BackendErrorDetailType>, string>({
    mutationFn: (id) => deleteProfile(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.detail ?? "Failed to remove shop logo",
        { duration: 5000 },
      );
    },
  });
}

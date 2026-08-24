// hooks/useDeleteStaff.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../types/error";
import { deleteProfile } from "../services/admin/staff";
import { toast } from "sonner";

export function useDeleteStaff() {

    const queryClient = useQueryClient();

  return useMutation<void, AxiosError<BackendErrorDetail>, string>({
    mutationFn: (id) => deleteProfile(id),

    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["staff"]
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

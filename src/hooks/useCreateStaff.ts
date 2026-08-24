// hooks/useCreateStaff.ts

import { useMutation } from "@tanstack/react-query";
import { createStaffAccount } from "../services/admin/staff";
import type { CreateStaffRequest, CreateStaffResponse } from "../types/staff";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../types/error";
import { toast } from "sonner";

type CreateStaffRequests = {
  data: CreateStaffRequest;
  image: File;
};

export function useCreateStaff() {
  return useMutation<
    CreateStaffResponse,
    AxiosError<BackendErrorDetail>,
    CreateStaffRequests
  >({
    mutationFn: ({ data, image }) =>
      createStaffAccount({ data: data, image: image }).then((res) => res.data),

    onError: (error) => {
      toast.error(
        error.response?.data?.detail ?? "Failed to update shop logo",
        { duration: 3000 },
      );
    },
  });
}

// hooks/useCreateStaff.ts

import { useMutation } from "@tanstack/react-query";
import { createStaffAccount } from "../services/staff";
import type { CreateStaffRequest, CreateStaffResponse } from "../types/staff";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types";

type CreateStaffRequests = {
  data: CreateStaffRequest;
  image: File;
};

export function useCreateStaff() {
  return useMutation<
    CreateStaffResponse,
    AxiosError<BackendErrorDetailType>,
    CreateStaffRequests
  >({
    mutationFn: ({ data, image }) =>
      createStaffAccount({ data: data, image: image }).then((res) => res.data),
  });
}

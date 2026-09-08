//
// hooks/useEditStaff.ts
//
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../types/error";
import type { EditStaffDataRequest } from "../types/staff";
import { editStaffDetail } from "../services/admin/staff";

interface EditStaffRequest {
  userId: string;
  data: EditStaffDataRequest;
  image: File | null;
}

export function useEditStaff() {
  return useMutation<void, AxiosError<BackendErrorDetail>, EditStaffRequest>({
    mutationFn: (request) =>
      editStaffDetail({
        userId: request.userId,
        data: request.data,
        file: request.image,
      }),
  });
}

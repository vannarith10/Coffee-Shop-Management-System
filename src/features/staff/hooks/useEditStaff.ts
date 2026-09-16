//
// hooks/useEditStaff.ts
//
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetailType } from "@/types";
import type { EditStaffDataRequest } from "../types/staff";
import { editStaffDetail } from "../services/staff"; 

interface EditStaffRequest {
  userId: string;
  data: EditStaffDataRequest;
  image: File | null;
}

export function useEditStaff() {
  return useMutation<void, AxiosError<BackendErrorDetailType>, EditStaffRequest>({
    mutationFn: (request) =>
      editStaffDetail({
        userId: request.userId,
        data: request.data,
        file: request.image,
      }),
  });
}

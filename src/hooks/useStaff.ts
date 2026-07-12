// hooks/useStaff.ts
// Tanstack

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStaffProfiles } from "../services/admin.service";
import { useEffect, useState } from "react";
import { useStaffUpdate } from "./useStaffUpdate";
import type { Staff, StaffProfileResponse } from "../types/staff";

export function useStaff({ page, size }: { page: number; size: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["staff", page, size];

  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<StaffProfileResponse>({
      queryKey,
      queryFn: () =>
        getAllStaffProfiles({ page, size }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  //=========================
  // WebSocket
  //=========================
  const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setJustUpdatedId(null);
    }, 5000);
  }, [justUpdatedId]);

  function handleStaffUpdated(updated: Staff) {
    setJustUpdatedId(updated.id);

    queryClient.setQueriesData<StaffProfileResponse>(
      { queryKey: ["staff"] },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          staffs: oldData.staffs.map((member) =>
            member.id === updated.id ? updated : member,
          ),
        };
      },
    );
  }

  useStaffUpdate({
    onEmployeeUpdated: handleStaffUpdated,
  });

  return {
    staff: data ?? null,
    isLoading,
    isError,
    isRefetching,
    refetch,
    justUpdatedId,
  };
}

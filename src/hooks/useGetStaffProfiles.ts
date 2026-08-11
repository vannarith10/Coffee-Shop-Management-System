// hooks/useStaff.ts
// Tanstack

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStaffProfiles } from "../services/admin.service";
import { useCallback, useEffect, useState } from "react";
import { useStaffUpdate } from "./websockets/useStaffUpdate";
import type { Staff, StaffProfileResponse } from "../types/staff";
import { useCreateStaffWebSocket } from "./websockets/useCreateStaffWebSocket";

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

  // ======================================
  // Fetch next page automatically
  // ======================================
  const totalPages = data?.pagination.total_pages ?? 1;
  useEffect(() => {
    if (!data) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    queryClient.prefetchQuery({
      queryKey: ["staff", nextPage, size],
      queryFn: () =>
        getAllStaffProfiles({ page: nextPage, size }).then((res) => res.data),
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });
  }, [data, page, totalPages, queryClient, size]);

  //=================================
  // WebSocket | Update Staff
  //=================================
  const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);

  useEffect(() => {
    if (!justUpdatedId) return;
    const timer = setTimeout(() => {
      setJustUpdatedId(null);
    }, 5000);
    return () => clearTimeout(timer);
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

  // ================================================
  // WebSocket | Add New Staff
  // ================================================
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  useEffect(() => {
    if (!justAddedId) return;
    const timeout = setTimeout(() => setJustAddedId(null), 5000);
    return () => clearTimeout(timeout);
  }, [justAddedId]);

  const handleAddNewStaff = useCallback(
    (newStaff: Staff) => {
      setJustAddedId(newStaff.id);

      console.log("New Staff ID: ", newStaff.id);

      queryClient.setQueryData<StaffProfileResponse>(
        ["staff", page, size],
        (oldData) => {
          if (!oldData) return oldData;

          const exists = oldData.staffs.some(
            (staff) => staff.id === newStaff.id,
          );

          if (exists) return oldData;

          return {
            ...oldData,
            staffs: [...oldData.staffs, newStaff],
            pagination: {
              ...oldData.pagination,
              total_items: oldData.pagination.total_items + 1,
            },
          };
        },
      );
    },
    [queryClient, page, size],
  );
  useCreateStaffWebSocket({ onAddNewStaff: handleAddNewStaff });

  return {
    staff: data ?? null,
    isLoading,
    isError,
    isRefetching,
    refetch,
    justUpdatedId,
    justAddedId,
  };
}

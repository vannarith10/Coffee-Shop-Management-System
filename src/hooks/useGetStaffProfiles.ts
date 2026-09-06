// hooks/useStaff.ts
// Tanstack

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getAllStaffProfiles } from "../services/admin/staff";
import { useCallback, useEffect, useState } from "react";
import { useStaffUpdate } from "../websocket/staff/useUpdateStaffWebsocket";
import type { Staff, StaffProfileResponse } from "../types/staff";
import { useCreateStaffWebSocket } from "../websocket/staff/useCreateStaffWebsocket";

export function useStaff({ page, size }: { page: number; size: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["staff", page, size];
  
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  const markHighlighted = (id: string) => {
    setHighlightedIds((prev) => new Set(prev).add(id));

    setTimeout(() => {
      setHighlightedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 6000);
  };

  //----------------------------------
  //
  // Fetching data
  //
  //----------------------------------
  const { data, isLoading, isError, isRefetching, refetch } =
    useQuery<StaffProfileResponse>({
      queryKey,
      queryFn: () =>
        getAllStaffProfiles({ page, size }).then((res) => res.data),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
    });

  // ----------------------------------
  //
  // Fetch next page automatically
  //
  // ----------------------------------
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
  function handleStaffUpdated(updated: Staff) {
    markHighlighted(updated.id);

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
  const handleAddNewStaff = useCallback(
    (newStaff: Staff) => {
      markHighlighted(newStaff.id);

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
    highlightedIds,
  };
}

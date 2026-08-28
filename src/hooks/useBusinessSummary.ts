// hooks/useBusinessSummary.ts
// Tanstack

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getBusinessSummary } from "../services/admin/analytic";
import type { BusinessSummaryResponse } from "../types/business-analytics";



export function useBusinessSummary () {


    const {data, isLoading, isError, refetch, isRefetching} = useQuery({
        queryKey: ["business-summary"],
        queryFn: () => getBusinessSummary().then((res) => res.data as BusinessSummaryResponse),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });

    return {summary: data || null, isLoading, isError, refetch, isRefetching};
}
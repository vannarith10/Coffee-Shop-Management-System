import { useQuery } from "@tanstack/react-query";
import { getRevenueTrends } from "../services/admin.service";
import type { RevenuTrendsResponse } from "../types/business-analytics";


export function useGetRevenueTrends ({month, year}:{month: number, year: number}) {

    const queryKey = ["revenue-trends", month, year];

    const {data, isLoading, isError, isRefetching, refetch} = useQuery<RevenuTrendsResponse[]>({
        queryKey,
        queryFn: () => getRevenueTrends ({month: month, year: year}).then((res) => res.data),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 30,
    });


    return {data, isLoading, isError, isRefetching, refetch};
}
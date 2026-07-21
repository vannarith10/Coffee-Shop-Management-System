import { useQuery } from "@tanstack/react-query";
import { type BusiestHoursResponse } from "../types/business-analytics";
import { getBusiestHours } from "../services/admin.service";


export function useGetBusiestHours () {

    const queryKey = ["busiest-hours"];

    const {data, isLoading, isError, isRefetching, refetch} = useQuery<BusiestHoursResponse>({
        queryKey,
        queryFn: () => getBusiestHours().then((res) => res.data),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 30,
    });

    
    return {data, isLoading, isError, isRefetching, refetch};
}
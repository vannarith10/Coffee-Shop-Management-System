import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/user.service";
import type { GetUserProfileResponse } from "../types/user";


export function useGetUserProfile () {

    const queryKey = ["user-profile"];

    const {data, isLoading, isError, isRefetching, refetch} = useQuery<GetUserProfileResponse>({
        queryKey,
        queryFn: () => getUserProfile().then((res) => res.data),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });

    return {data, isLoading, isError, isRefetching, refetch};
}
import { useQuery } from "@tanstack/react-query";
import { getShopInfo } from "../services/admin.service";
import type { ShopInfo } from "../types/shop-setting";



export function useGetShopInfo () {

    const queryKey = ["shop-info"];

    const {data, isLoading, isError, isRefetching, refetch} = useQuery<ShopInfo>({
        queryKey,
        queryFn: () => getShopInfo().then((res) => res.data),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });

    return {data, isLoading, isError, isRefetching, refetch};
}
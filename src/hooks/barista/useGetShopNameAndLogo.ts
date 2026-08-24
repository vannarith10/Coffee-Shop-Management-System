//
import { useQuery } from "@tanstack/react-query";
import { getShopImageAndName } from "../../services/admin/shop";
import type { ShopNameAndLogo } from "../../types/shop-setting";



export function useGetShopNameAndLogo () {

    const queryKey = ["shop-name-and-logo"];

    const {data, isLoading, isError, isRefetching, refetch} = useQuery<ShopNameAndLogo>({
        queryKey,
        queryFn: () => getShopImageAndName().then((res) => res.data),
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 60 * 30,
    });


    return {data, isLoading, isError, isRefetching, refetch};
}
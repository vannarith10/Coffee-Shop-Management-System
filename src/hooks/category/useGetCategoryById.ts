import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../../services/admin/category";
import type { Category } from "../../types/category/category";


export function useGetCategoryById (id: string) {

    const queryKey = ["category", id];

    return useQuery<Category>({
        queryKey,
        queryFn: () => getCategoryById(id).then(res => res.data),
        staleTime: 0,
        refetchOnMount: "always",
    });
}
import {  useQuery } from "@tanstack/react-query";
import type { Staff } from "../../types/staff";
import { getASpecificProfile } from "../../services/admin/staff";


export function useGetASingleProfile (id: string) {

    const queryKey = ["staff-profile", id];

    return useQuery<Staff>({
        queryKey,
        queryFn: () => getASpecificProfile(id).then((res) => res.data),
        staleTime: 0,
        refetchOnMount: "always",
    })
}
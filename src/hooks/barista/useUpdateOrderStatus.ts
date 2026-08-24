//
// hooks/barista/useUpdateOrderStatus.ts
//

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BackendErrorDetail } from "../../types/error";
import type { RetrieveOrderStatus } from "../../types/barista/order";
import { updateOrderStatus } from "../../services/barista/order";

interface UpdateStatusRequest {
    id: string;
    status: RetrieveOrderStatus;
}

export function useUpdateOrderStatus () {

    return useMutation<void, AxiosError<BackendErrorDetail>, UpdateStatusRequest> ({
        mutationFn: ({id, status}) => updateOrderStatus({id: id, status: status})
    });
}
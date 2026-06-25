//service/barista.service.ts

import api from "../lib/axios";


export const getOrders = async () => {
    const response = await api.get("/api/v2/barista-order/get-orders");

    return response.data;
}
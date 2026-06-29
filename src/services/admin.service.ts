// service/admin.service.ts
//
import type { AxiosResponse } from "axios";
import api from "../lib/axios";
import { publicApi } from "../lib/axios";
import type { TopSellingProductRequest } from "../types/business-analytics";
import type { PRODUCT_STOCK_STATUS } from "../types/product";
import type { Role } from "../types/role";
import type { Status } from "../types/status";
import type { Shift } from "../types/shift";
import type { Schedule } from "../types/schedule";
import type { EditStaffDataRequest } from "../types/staff";

interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  detail: string;
}

//
//
// Get employee profiles
//
export const getAllEmployeeProfiles = async () => {
  const response = await api.get("/api/v2/employee/profiles?page=1&size=20");
  return response.data;
};
//
//
// Get shop's image and name
export const getShopImageAndName = async () => {
  const response = await publicApi.get(
    "/api/v2/shop-profile/shop-name/shop-image",
  );
  return response.data;
};
//
//
// Get Business Summary Data
//
export const getBusinessSummary = async () => {
  const response = await api.get("/api/v2/analytics/summary");
  return response.data;
};
//
//
// Get top selling product to display at Admin Dashboard
//
export const getTopSellingProduct = async ({
  range,
  page,
  size,
}: TopSellingProductRequest) => {
  const response = await api.post("/api/v2/analytics/top-selling-products", {
    range: range,
    page: page,
    size: size,
  });
  return response;
};
//
//
// Get All Products Status
//
export const getAllProductsStatus = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const response = await api.get(
    `/api/v2/product/get-statuses?page=${page}&size=${size}`,
  );
  return response;
};
//
//
// Update Stock Status
//
export async function updateStockStatus({
  productId,
  newStatus,
}: {
  productId: string;
  newStatus: PRODUCT_STOCK_STATUS;
}): Promise<AxiosResponse<void> | AxiosResponse<ApiError>> {
  const response = await api.post<void>(
    `/api/v2/product/update/${productId}/stock-status?status=${newStatus}`,
  );
  return response;
}
//
//
// Get All Staff Profiles
//
export async function getAllStaffProfiles({
  page,
  size,
}: {
  page: number;
  size: number;
}) {
  const response = await api.get(
    `/api/v2/employee/profiles?page=${page}&size=${size}`,
  );
  return response;
}
//
//
//
// UPDATE STAFF PROFILE
//
export async function editStaffDetail ({userId, data, file}:{userId:string, data:EditStaffDataRequest, file?:File | null}) {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(data)], {type: "application/json"}));
  if (file) {
    formData.append("image", file);
  }
  const response = api.patch(`/api/v2/employee/${userId}/edit`, formData);
  return response;
}

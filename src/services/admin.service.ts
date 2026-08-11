// service/admin.service.ts
//
import type { AxiosResponse } from "axios";
import api from "../lib/axios";
import { publicApi } from "../lib/axios";
import type {
  Range,
  TopSellingProductRequest,
} from "../types/business-analytics";
import type {
  AddNewProductRequest,
  PRODUCT_STOCK_STATUS,
  UpdateProductRequest,
} from "../types/product";
import type { CreateStaffRequest, EditStaffDataRequest } from "../types/staff";
import type {
  CATEGORY_TYPE,
  CreateCategoryRequest,
  PatchCategoryRequest,
} from "../types/category";
import type { ShopLogoUpdateResponse, UpdateShopInfoRequest } from "../types/shop-setting";

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
//
export const getShopImageAndName = async () => {
  return await publicApi.get("/api/v2/shop-profile/shop-name/shop-image");
};
//
//
// Get Business Summary Data
//
export const getBusinessSummary = async () => {
  const response = await api.get("/api/v2/analytics/summary");
  return response;
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
export async function editStaffDetail({
  userId,
  data,
  file,
}: {
  userId: string;
  data: EditStaffDataRequest;
  file?: File | null;
}) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (file) {
    formData.append("image", file);
  }
  const response = api.patch(`/api/v2/employee/${userId}/edit`, formData);
  return response;
}
//
//
//
// GET ALL CATEGORIES
//
export async function getAllCategories({
  page,
  size,
}: {
  page: number;
  size: number;
}) {
  const response = await api.get(`/api/v2/category?page=${page}&size=${size}`);
  return response;
}
//
//
//
// PATCH CATEGORY
//
export async function patchCategory({
  categoryId,
  data,
}: {
  categoryId: string;
  data: PatchCategoryRequest;
}) {
  const response = await api.patch(`/api/v2/category/${categoryId}`, data);
  return response;
}
//
//
//
// CREATE CATEGORY
//
export async function createCategory({
  data,
}: {
  data: CreateCategoryRequest;
}) {
  const response = await api.post("/api/v2/category", data);
  return response;
}
//
//
//
// GET CATEGORY STATUS
//
export async function getCategoryStatusSummary() {
  const res = await api.get("/api/v2/category/category-status");
  return res;
}
//
//
//
// Create Staff Account
//
export async function createStaffAccount({
  data,
  image,
}: {
  data: CreateStaffRequest;
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }
  const res = await api.post("/api/v2/employee/create-account", formData);
  return res;
}
//
//
//
// Get all product
// Filter
//
export async function getAllProducts({
  page,
  size,
  categoryType,
  categoryName,
  keyword,
}: {
  page: number;
  size: number;
  categoryType: CATEGORY_TYPE | "ALL";
  categoryName: string | null;
  keyword: string | null;
}) {
  const params: Record<string, string | number> = { page, size };

  if (keyword !== null) {
    params.keyword = keyword;
  }
  if (categoryType !== "ALL") {
    params.category_type = categoryType;
  }
  if (categoryName !== null) {
    params.category_name = categoryName;
  }
  return await api.get("api/v2/product/get-all-products", { params });
}
//
//
//
// Get a single product
//
export async function getASingleProduct({ id }: { id: string }) {
  const res = await api.get(`/api/v2/product/get-a-single/${id}`);
  return res;
}
//
//
//
// Update product | PATCH
//
export async function patchProduct({
  id,
  data,
  image,
}: {
  id: string;
  data: UpdateProductRequest;
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (image) {
    formData.append("image", image);
  }
  const res = await api.patch(`/api/v2/product/${id}/patch`, formData);
  return res;
}
//
//
//
// Get All Category Names
//
export async function getAllCategoryNames() {
  return await api.get("/api/v2/category/names");
}
//
//
//
// Add new Product
//
export async function addNewProduct({
  data,
  image,
}: {
  data: AddNewProductRequest;
  image: File;
}) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], 
    { type: "application/json" }),
  );
  formData.append("image", image);
  return await api.post("/api/v2/product/add-new", formData);
}
//
//
//
// Get Sales By Category
//
export async function getSalesByCategory({ range }: { range: Range }) {
  return await api.get(`/api/v2/reports/sales-by-category/${range}`);
}
//
//
//
// Get Busiest Hours
//
export async function getBusiestHours() {
  return await api.get(`/api/v2/reports/busiest-hours`);
}
//
//
//
// Get Revenue Trends
//
export async function getRevenueTrends({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  return await api.get(`/api/v2/reports/revenue-trends/${month}/${year}`);
}
//
//
//
// Get Shop Info
//
export async function getShopInfo() {
  return await api.get("/api/v2/shop-profile");
}
//
//
// void doens't need to return
// Delete Shop Logo
//
export async function deleteShopLogo(): Promise<void> {
  await api.delete("/api/v2/shop-profile/delete-logo");
}
//
//
//
// Update Shop Logo
//
export async function updateShopLogo(
  image: File,
): Promise<ShopLogoUpdateResponse> {
  const formData = new FormData();
  formData.append("image", image);
  return await api.put("/api/v2/shop-profile/update-logo", formData);
}
//
//
//
// Update Shop Info
//
export async function updateShopInfo(data: UpdateShopInfoRequest): Promise<void> {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(data)], 
    { type: "application/json" }),);
  
  await api.patch("/api/v2/shop-profile/update", formData);
}
//
//
//
//
// Delete Profile
//
export async function deleteProfile (id:string): Promise<void> {
  await api.delete(`/api/v2/employee/${id}/delete`);
}
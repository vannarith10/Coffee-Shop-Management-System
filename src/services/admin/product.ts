import api from "../../lib/axios";
import type { TopSellingProductRequest } from "../../types/business-analytics";
import type { CATEGORY_TYPE } from "../../types/category/category";
import type {
  AddNewProductRequest,
  UpdateProductRequest,
} from "../../types/product";

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
// Get a single product
//
export async function getASingleProduct({ id }: { id: string }) {
  const res = await api.get(`/api/v2/product/get-a-single/${id}`);
  return res;
}

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
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  formData.append("image", image);
  return await api.post("/api/v2/product/add-new", formData);
}

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

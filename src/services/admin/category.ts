import api from "../../lib/axios";
import type { Range } from "../../types/business-analytics";
import type {
  CreateCategoryRequest,
  PatchCategoryRequest,
} from "../../types/category/category";

//
// GET ALL
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
// PATCH
//
export async function patchCategory({
  categoryId,
  data,
}: {
  categoryId: string;
  data: PatchCategoryRequest;
}): Promise<void> {
  return await api.patch(`/api/v2/category/${categoryId}`, data);
}

//
// CREATE
//
export async function createCategory({
  data,
}: {
  data: CreateCategoryRequest;
}): Promise<void> {
   await api.post("/api/v2/category", data);
}

//
// GET CATEGORY STATUS
//
export async function getCategoryStatusSummary() {
  const res = await api.get("/api/v2/category/category-status");
  return res;
}

//
// Get All Names
//
export async function getAllCategoryNames() {
  return await api.get("/api/v2/category/names");
}

//
// Get Sales By Category
//
export async function getSalesByCategory({ range }: { range: Range }) {
  return await api.get(`/api/v2/reports/sales-by-category/${range}`);
}




export async function getCategoryById (id: string) {
  return await api.get(`/api/v2/category/${id}`);
}


import api from "../../lib/axios";
import type { Range } from "../../types/business-analytics";
import type { CreateCategoryRequest, PatchCategoryRequest } from "../../types/category";



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
// GET CATEGORY STATUS
//
export async function getCategoryStatusSummary() {
  const res = await api.get("/api/v2/category/category-status");
  return res;
}


//
// Get All Category Names
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
import api from "../../lib/axios";
import type { CategoryType } from "@/types";

//
// Get Menu
// Filter
//
export async function getMenu({
  page,
  size,
  categoryType,
  categoryName,
  keyword,
}: {
  page: number;
  size: number;
  categoryType: CategoryType | "ALL";
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
  return await api.get("/api/v2/menu-query", { params });
}

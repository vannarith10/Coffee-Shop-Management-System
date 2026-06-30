// utils/staff-cache.ts
//

import type { Product, StockStatusResponse } from "../types/product";
import type { Staff, StaffProfileResponse } from "../types/staff";

//
// This used to update new staff's details
//
export function updateStaffInCache (cache: Record<number, StaffProfileResponse>, updatedStaff: Staff) {
    const newCache = {...cache};

    for (const pageNumber in newCache) {
        newCache[Number(pageNumber)] = {
            ...newCache[Number(pageNumber)], staffs: newCache[Number(pageNumber)].staffs.map((staff) =>
            staff.id === updatedStaff.id ? updatedStaff : staff)
        };
    }

    return newCache;
}


//
// For updating product stock status
//
export function updateStockStatusInCache (cache: Record<number, StockStatusResponse>, updatedStock: Product) {
    const newCache = {...cache};

    for (const pageNumber in newCache) {
        newCache[Number(pageNumber)] = {
            ...newCache[Number(pageNumber)], products: newCache[Number(pageNumber)].products.map((product) => 
                product.id === updatedStock.id ? updatedStock : product)
            };
        }

    return newCache;
}
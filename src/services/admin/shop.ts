
import api, { publicApi } from "../../lib/axios";
import type { ShopLogoUpdateResponse, UpdateShopInfoRequest } from "../../types/shop-setting";






//
// Get shop's image and name
//
export const getShopImageAndName = async () => {
  return await publicApi.get("/api/v2/shop-profile/shop-name/shop-image");
};


//
// Get Shop Info
//
export async function getShopInfo() {
  return await api.get("/api/v2/shop-profile");
}


//
// void doens't need to return
// Delete Shop Logo
//
export async function deleteShopLogo(): Promise<void> {
  await api.delete("/api/v2/shop-profile/delete-logo");
}


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
// Update Shop Info
//
export async function updateShopInfo(
  data: UpdateShopInfoRequest,
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  await api.patch("/api/v2/shop-profile/update", formData);
}
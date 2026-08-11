// types/shop-setting.ts


export interface ShopInfo {
    name: string;
    contact: number;
    address: string;
    description: string;
    image_url: string;
    region: string;
}


export interface ShopNameAndLogo {
    name: string;
    image_url: string;
}


export interface ShopLogoUpdateResponse {
    image_url: string
}


export interface UpdateShopInfoRequest {
  name: string;
  contact: string | null;
  address: string | null;
  description: string | null;
}
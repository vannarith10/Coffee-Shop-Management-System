// components/StockStatus.tsx
//
import { Layers2 } from "lucide-react";
import type { CATEGORY_TYPE } from "../types/category";
import type { PRODUCT_STOCK_STATUS } from "../types/product";
import { useEffect, useState } from "react";
import { STOCK_STATUS_CONFIG } from "../types/stock-status";
import { getAllProductsStatus } from "../services/admin.service";

interface Product {
  id: string;
  name: string;
  category_name: string;
  category_type: CATEGORY_TYPE;
  status: PRODUCT_STOCK_STATUS;
}

interface StockStatusResponse {
  message: string;
  pagination: {
    page: number;
    size: number;
    total_pages: number;
    total_items: number;
  };
  products: Product[];
}

export default function StockStatus() {
  const [product, setProduct] = useState<StockStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // Fetching Data from API
  useEffect(() => {
    async function fetchData() {
        try {
            const response = await getAllProductsStatus({page, size});
            setProduct(response);
        } catch (error) {
            console.error(error);
            setIsError(true);
        }
        setIsLoading(false);
    }
    fetchData();
  }, [page, size]);

  return (
    <section className="w-full bg-background-secondary text-text-primary rounded-lg mt-4 overflow-hidden border-border border">
        {/*  */}
      {/* Stock Status Title */}
      <div className="w-full p-6 flex gap-4 bg-background-secondary-hover">
        <Layers2 />
        <h3 className="font-semibold">Stoct Status</h3>
      </div>
      {/*  */}
      {/* Header */}
      <div className="grid grid-cols-6 bg-sidebar text-text-secondary p-4 px-6 text-[10px] xl:text-sm font-bold uppercase">
        <h4 className="col-span-2">Item Name</h4>
        <h4>Category</h4>
        <h4>Current Stock</h4>
        <h4 className="w-full text-center">Status</h4>
        <h4 className="text-right w-full">Action</h4>
      </div>
      {/*  */}
      {/* Display list of products */}
      {product?.products.map((p) => {
            const config = STOCK_STATUS_CONFIG[p.status];
        return (
          <div key={p.id} className="grid grid-cols-6 items-center px-6 py-4 text-xs xl:text-base border-t border-border hover:bg-background-secondary-hover">
            {/*  */}
            {/* Product Name */}
            <h4 className="col-span-2 font-bold ">{p.name}</h4>
            {/*  */}
            {/* Catogory */}
            <div className="h-full flex flex-col justify-center">
              <h5 className="text-[10px] xl:text-xs uppercase">
                {p.category_type}
              </h5>
              <h5 className="font-semibold">{p.category_name}</h5>
            </div>
            {/*  */}
            {/* Current Stock */}
            <h4 className="font-bold">Comming soon</h4>
            {/*  */}
            {/* Stock Status */}
            <div className={`${config.colorClass} justify-self-center inline-block py-1 px-3 rounded-sm`}>
              <h4 className="font-bold text-white text-center uppercase">
                {config.label}
              </h4>
            </div>
            {/* Restock Button */}
            <button className="py-1 px-6 bg-green-600 text-white font-bold rounded-sm justify-self-end cursor-pointer hover:scale-110 active:scale-90 focus:outline-none transition-all duration-300 ease-out">
              Restock
            </button>
          </div>
        );
      })}

      {/*  */}
    </section>
  );
}

const responses: StockStatusResponse = {
  message: "Product stock statuses",
  pagination: {
    page: 1,
    size: 20,
    total_pages: 2,
    total_items: 39,
  },
  products: [
    {
      id: "4bedae29-d330-4d8e-af0b-c81c3a01d2fa",
      name: "Vanilla Latte",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "bc09155a-8972-4f5d-8f8b-dd4dffac810c",
      name: "Iced Coffe",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "be73a333-e6da-4b08-b970-db05ce327106",
      name: "Double Espresso",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "e04560da-05d2-468c-aec4-6b36c22d0f61",
      name: "Irish Coffee",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "48dd37fd-6734-4ec1-83bd-a2b488922312",
      name: "Green Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "ab8ce94f-d935-4999-9b0a-2e6a71198431",
      name: "Black Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "c9ef8f5f-6e4b-424a-a3c4-3822bc42f66e",
      name: "Milk Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "aeaadd31-a504-4169-85f4-1ead7d1ca660",
      name: "Latte",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "LOW_STOCK",
    },
    {
      id: "0bee087f-3bd4-4310-b827-77d3fb48b310",
      name: "americano",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "OUT_OF_STOCK",
    },
    {
      id: "49f4c461-9972-40a0-b49c-f52f924e9545",
      name: "Mocha",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "OUT_OF_STOCK",
    },
    {
      id: "0e3c09c0-47eb-4e65-9af9-1548b9b7969d",
      name: "Cappuccino",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "OUT_OF_STOCK",
    },
    {
      id: "359dee65-6542-4159-938a-5bbf992d5384",
      name: "Flat White",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "OUT_OF_STOCK",
    },
    {
      id: "67d234cd-3136-40f2-9031-799fe165f9a1",
      name: "Vannarith",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "4054ec7f-87a2-48f9-ae45-56e7c6e74981",
      name: "Caramel Macchiato",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "LOW_STOCK",
    },
    {
      id: "1a706848-2058-438f-bb60-46feacf923bc",
      name: "Hazelnut Latte",
      category_name: "COFFEE",
      category_type: "DRINK",
      status: "LOW_STOCK",
    },
    {
      id: "de2b274c-2d41-4c9e-ac62-91abef0bab5a",
      name: "Lemon Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "19cc3253-727a-4c43-a3a1-be0edc6f7970",
      name: "Honey Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "d29eb1db-9ba9-4c96-84ec-c73f6a22b2fe",
      name: "Peach Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "fbf6f0d2-4db3-4339-af40-34ecc4b7fa21",
      name: "Iced Green Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
    {
      id: "ccb5b2bd-d141-445a-85b2-1ba7a9549059",
      name: "Matcha Tea",
      category_name: "TEA",
      category_type: "DRINK",
      status: "IN_STOCK",
    },
  ],
};

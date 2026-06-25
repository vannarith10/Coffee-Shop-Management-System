// components/TopSellingProducts.tsx
//

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { getTopSellingProduct } from "../services/admin.service";
import type { Range } from "../types/business-analytics";

interface Product {
  product_id: string;
  product_name: string;
  image_url: string;
  units_sold: number;
}

interface TopSellingResponse {
  pagination: {
    page: number;
    size: number;
    total_pages: number;
    total_items: number;
  };
  units_target: number;
  top_products: Product[];
}

export default function TopSellingProductsChart() {
  const [data, setData] = useState<TopSellingResponse | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [range, setRange] = useState<Range>("ALL");
    
  // Fetching Data
  useEffect(() => {
    async function fetchingData(){
        try {
            const response = await getTopSellingProduct({range, page, size});
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    fetchingData();
  }, [page, size, range])

    const filtered = data?.top_products.sort((a, b) => b.units_sold - a.units_sold)
    .map((product) => {
      const percentage = (product.units_sold / data.units_target) * 100;

      return {
        id: product.product_id,
        name: product.product_name,
        sold: product.units_sold,
        image: product.image_url,
        percentage,
        color:
          percentage >= 80
            ? "#22c55e" // green
            : percentage >= 50
              ? "#eab308" // yellow
              : "#ef4444", // red
      };
    });

  return (
    <section className="w-full rounded-lg border-2 border-border bg-background-secondary p-6 mt-4">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">
          Top Selling Products
        </h3>

        <p className="text-sm text-muted-foreground text-text-secondary">
          Volume distribution by unit sales
        </p>
      </div>

      <div className="space-y-6">
        {filtered?.map((product) => (
          <div key={product.id} >
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-sm text-text-secondary">
                {product.name}
              </span>

              <span className="text-sm text-muted-foreground text-text-secondary">
                {product.sold} units
              </span>
            </div>

            {/* Progress Bar */}
            <ResponsiveContainer width="100%" height={14} >
              <BarChart
                data={[product]}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis type="number" domain={[0, data?.units_target || 0]} hide />

                <YAxis type="category" dataKey="name" hide />

                <Bar dataKey="sold" radius={[4, 4, 4, 4]} barSize={14}>
                  <Cell fill={product.color} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/*  */}
      {/* The 3 colors bottom */}
      <div className="mt-6 border-t-2 pt-4 border-border">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-text-secondary">Below 50%</span>
          </div>

          <div className="flex items-center gap-2 ">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-text-secondary">50% - 79%</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-text-secondary">80%+</span>
          </div>
        </div>

        <p className="mt-2 text-xs font-bold text-muted-foreground text-text-secondary">
          Unit Target: {data?.units_target}
        </p>
      </div>
      {/*  */}
    </section>
  );
}


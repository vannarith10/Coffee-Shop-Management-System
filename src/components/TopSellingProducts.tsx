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
import { RANGES, type Range } from "../types/business-analytics";
import TextLoader from "./ui/TextLoader";
import { RotateCcw } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const size = 10;
  const [selectedRange, setSelectedRange] = useState<Range>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [refetchVersion, setRefetchVersion] = useState(0);

  // Fetching Data
  useEffect(() => {
    async function fetchingData() {
      setIsLoading(true);
      try {
        const range = selectedRange;
        const response = await getTopSellingProduct({ range, page, size });
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
    fetchingData();
  }, [page, size, selectedRange, refetchVersion]);

  //
  // Handle Refresh | Retry
  function handleRefresh() {
    setPage(1);
    setRefetchVersion((v) => v + 1);
  }
  //
  //
  function handleFilterRange(range: Range) {
    setSelectedRange(range);
  }

  // Showing most sold first
  const filtered = data?.top_products
    .sort((a, b) => b.units_sold - a.units_sold)
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
      {/*  */}
      {/* Header */}
      <div className="mb-6 flex justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            Top Selling Products
          </h3>
          <p className="text-sm text-muted-foreground text-text-secondary">
            Volume distribution by unit sales
          </p>
        </div>
        {/* Refresh */}
        <div className="flex items-center">
          <button
            onClick={handleRefresh}
            className="font-bold text-sm text-white items-center flex gap-2 bg-sidebar px-3 py-1 rounded-md cursor-pointer hover:bg-background-secondary-hover active:scale-90 transition-all duration-100 ease-out outline-none"
          >
            {" "}
            Refresh <RotateCcw />{" "}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="w-full mb-4 flex flex-wrap gap-4">
        {RANGES.map((range) => {
          return (
            <button
              onClick={() => handleFilterRange(range)}
              key={range}
              className={`${range === selectedRange ? "bg-green-600" : "bg-background-secondary"} font-bold rounded-sm text-xs border border-border py-2 px-4 cursor-pointer hover:border-border-hover active:scale-90 transition-all duration-100 ease-out outline-none`}
            >
              {/* Turn "THIS_WEEK" to "THIS WEEK" */}
              {range.replaceAll("_", " ")}
            </button>
          );
        })}
      </div>

      {/* Handle Loading... */}
      {isLoading && (
        <div className="w-full text-xl py-10 flex items-center justify-center">
          <TextLoader text="Loading..." />
        </div>
      )}

      {/*  */}
      {/* Display Data */}
      {!isLoading && (
        <div className="space-y-6">
          {filtered?.length == 0 ? (
            <div className="w-full flex justify-center items-center py-10 font-bold">
              No data for {selectedRange.replace("_", " ").toLowerCase()}
            </div>
          ) : (
            filtered?.map((product) => (
              <div key={product.id}>
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
                <ResponsiveContainer width="100%" height={14}>
                  <BarChart
                    data={[{ ...product, target: data?.units_target || 0 }]}
                    layout="vertical"
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, data?.units_target || 0]}
                      hide
                    />

                    <YAxis type="category" dataKey="name" hide />

                    {/* Actual sold bar */}
                    <Bar dataKey="sold" radius={[0, 0, 0, 0]} barSize={14} background={{fill:"#d3d3d3"}}>
                      <Cell fill={product.color} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))
          )}
        </div>
      )}

      {/* FOOTER */}
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

// components/TopSellingProducts.tsx
//

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { RANGES, type Range } from "../../types/business-analytics";
import TextLoader from "../ui/TextLoader";
import { RotateCcw } from "lucide-react";
import { useTopSellingProduct } from "../../hooks/useTopSellingProduct";

export default function TopSellingProductsChart() {
  // const [page, setPage] = useState(1);
  const page = 1;
  const size = 20;
  const [selectedRange, setSelectedRange] = useState<Range>("TODAY");

  const { topSelling, isLoading, isError, refetch, isRefetching } =
    useTopSellingProduct({ range: selectedRange, page, size });

  function handleFilterRange(range: Range) {
    setSelectedRange(range);
  }

  // ======================================
  // Showing most sold first | Filter
  // ======================================
  const filtered = topSelling?.top_products
    .sort((a, b) => b.units_sold - a.units_sold)
    .map((product) => {
      const percentage = (product.units_sold / topSelling.units_target) * 100;

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
      {/* ------------------------------------------------------------
      *
                                Header
      *
      --------------------------------------------------------------*/}
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            Top Selling Products
          </h3>
          <p className="text-sm text-muted-foreground text-text-secondary">
            Volume distribution by unit sales
          </p>
        </div>

      {/* ------------------------------------------------------------
      *
                            Button refresh
      *
      --------------------------------------------------------------*/}
        <div className="flex items-center">
          <button
            onClick={() => refetch()}
            className="font-bold text-sm text-white items-center flex gap-2 bg-sidebar px-3 py-1 rounded-md cursor-pointer hover:bg-background-secondary-hover active:scale-90 transition-all duration-100 ease-out outline-none"
          >
            {isRefetching ? (
              "Syncing..."
            ) : (
              <>
                Refresh <RotateCcw />
              </>
            )}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------
      *
                            Range filter
      *
      --------------------------------------------------------------*/}
      <div className="w-full mb-4 flex flex-wrap gap-2">
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

      {/* ------------------------------------------------------------
      *
                            Loading...
      *
      --------------------------------------------------------------*/}
      {(isLoading || isRefetching) && (
        <div className="w-full text-xl py-10 flex items-center justify-center">
          <TextLoader text="Loading..." />
        </div>
      )}

      {/* ------------------------------------------------------------
      *
                              Error
      *
      --------------------------------------------------------------*/}
      {isError && (
        <div className="w-full py-20 flex flex-col justify-center items-center gap-4">
          <p className="text-lg font-semibold text-text-error">
            Failed to load product data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-background-secondary-hover font-bold py-2 px-4 rounded-md flex gap-2 hover:bg-sidebar cursor-pointer active:scale-80 transition-all duration-200 ease-out"
          >
            Retry <RotateCcw />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------
      *
                            Displaying Data 
      *
      --------------------------------------------------------------*/}
      {!isLoading && !isError && !isRefetching && (
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
                    data={[
                      { ...product, target: topSelling?.units_target || 0 },
                    ]}
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
                      domain={[0, topSelling?.units_target || 0]}
                      hide
                    />

                    <YAxis type="category" dataKey="name" hide />

                    {/* Actual sold bar */}
                    <Bar
                      dataKey="sold"
                      radius={[0, 0, 0, 0]}
                      barSize={14}
                      background={{ fill: "#d3d3d3" }}
                    >
                      <Cell fill={product.color} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))
          )}
        </div>
      )}

      {/* ------------------------------------------------------------
      *
                                Footer
      *
      --------------------------------------------------------------*/}
      <footer className="mt-6 border-t-2 pt-4 border-border">
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
          Unit Target: {topSelling?.units_target}
        </p>
      </footer>
      {/*  */}
    </section>
  );
}

// components/admin/SellByCategory.tsx
//
import { ResponsivePie } from "@nivo/pie";
import { COLORS } from "../../utils/colors";
import { useGetSalesByCategory } from "../../hooks/useGetSalesByCategory";
import { RANGES, type Range } from "../../types/business-analytics";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import TextLoader from "../ui/TextLoader";

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  color: string;
}

const SellByCategory = () => {
  const [selectedRange, setSelectedRange] = useState<Range>("ALL");

  const { data, isLoading, isError, isRefetching, refetch } =
    useGetSalesByCategory({
      range: selectedRange,
    });

  const hasData = data?.some((d) => d.revenue > 0) ?? false;

  const chartData: ChartDatum[] =
    data && data.length > 0
      ? data?.map((d, idx) => ({
          id: d.category_id,
          label: d.category_name,
          value: d.revenue,
          color: COLORS[idx],
        }))
      : [
          {
            id: "empty",
            label: "No Data",
            value: 1,
            color: "#d1d5db",
          },
        ];

  const totalRevenue = chartData?.reduce((sum, item) => sum + item.value, 0);

  function handleFilterRange(range: Range) {
    setSelectedRange(range);
  }

  // Build data for Category Type
  const categoryTypeData: ChartDatum[] = Object.values(
    (data || []).reduce(
      (acc, item) => {
        if (!acc[item.category_type]) {
          acc[item.category_type] = {
            id: item.category_type,
            label: item.category_type,
            value: 0,
            color: "",
          };
        }

        acc[item.category_type].value += item.revenue;

        return acc;
      },
      {} as Record<string, ChartDatum>,
    ),
  ).map((item, idx) => ({
    ...item,
    color: COLORS.reverse()[idx],
  }));

  return (
    <section className="min-h-100 bg-background-secondary p-6 gap-4 flex flex-col rounded-lg border-2 border-border">
      {/* ================================ */}
      {/* Title */}
      {/* ================================ */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold">Sales by Category</h3>
          <p className="text-text-secondary text-sm">
            Revenue distribution across product lines
          </p>
        </div>
        <div>
          <button
            onClick={() => refetch()}
            className="col-start-2 xl:col-start-4 flex justify-center gap-2 items-center bg-background-secondary py-2 px-4 rounded-md border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
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
      </div>

      {/* ================================= */}
      {/* Filter range*/}
      {/* ================================= */}
      <div className="w-full mb-4 flex flex-wrap gap-4">
        {RANGES.map((range) => {
          return (
            <button
              onClick={() => handleFilterRange(range)}
              key={range}
              className={`${range === selectedRange ? "bg-green-600" : "bg-background-secondary"} font-bold rounded-sm text-xs border border-border py-2 px-4 cursor-pointer hover:border-border-hover active:scale-90 transition-all duration-200 ease-out outline-none`}
            >
              {/* Turn "THIS_WEEK" to "THIS WEEK" */}
              {range.replaceAll("_", " ")}
            </button>
          );
        })}
      </div>

      {/* ================================== */}
      {/* Handle Loading */}
      {/* ================================== */}
      {isLoading && (
        <div className="h-100 flex justify-center items-center">
          <TextLoader />
        </div>
      )}

      {/* =================================== */}
      {/* Handle Error */}
      {/* =================================== */}
      {isError && (
        <div className="w-full py-20 flex flex-col justify-center items-center gap-4">
          <p className="text-lg font-semibold text-text-error">
            Failed to load data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-background-secondary-hover font-bold py-2 px-4 rounded-md flex gap-2 hover:bg-sidebar cursor-pointer active:scale-80 transition-all duration-200 ease-out"
          >
            Retry <RotateCcw />
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* ================| Donuts container |==================*/}
      {/* ==================================================== */}
      {!isLoading && !isError && (
        <div className="flex flex-col xl:grid xl:grid-cols-2 xl:gap-6">
          {/* ================================================= */}
          {/* Donut | Category Name*/}
          {/* ================================================= */}
          <div>
            <div className="h-100">
              <ResponsivePie
                data={chartData}
                colors={(d) => d.data.color}
                margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={(d) => d.data.color}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLinkLabel={(d) => d.data.label}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 4]],
                }}
                // ---------------------------------------
                //   Tooltip
                // ---------------------------------------
                tooltip={({ datum }) => (
                  <div className="bg-background-secondary/10 backdrop-blur-sm px-4 py-2 border border-border rounded-md">
                    <strong className="whitespace-nowrap" style={{ color: datum.color }}>
                      {datum.label}
                    </strong>
                    <br />
                    {hasData && (
                      <>
                        <span className="whitespace-nowrap">
                          Revenue: ${datum.value}
                        </span>
                        <br />
                        <span className="whitespace-nowrap">
                          Share:{" "}
                          {((datum.value / totalRevenue) * 100).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                )}
              />
            </div>
            {/* ========================================================= */}
            {/* Custom Legends */}
            {/* ========================================================= */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {chartData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-background-secondary-hover px-2 py-1 rounded-md"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white text-sm">{item.label}</span>
                  {hasData && <span>{((item.value / totalRevenue) * 100).toFixed(1)}%</span>}
                </div>
              ))}
            </div>
          </div>
          {/* =============================================================================================== */}
          {/* Donut | Category Type*/}
          {/* =============================================================================================== */}
          {hasData && (<div className="flex flex-col border-t border-border mt-6 xl:mt-0 xl:border-none">
            <div className="h-100 col-span-2">
              <ResponsivePie
                data={categoryTypeData}
                colors={(d) => d.data.color}
                margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={(d) => d.data.color}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLinkLabel={(d) => d.data.label}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 4]],
                }}
                // ---------------------------------------
                //   Tooltip
                // ---------------------------------------
                tooltip={({ datum }) => (
                  <div className="bg-background-secondary/10 backdrop-blur-sm px-4 py-2 border border-border rounded-md">
                    <strong style={{ color: datum.color }}>
                      {datum.label}
                    </strong>
                    <br />
                    <span className="whitespace-nowrap">
                      Revenue: ${datum.value}
                    </span>
                    <br />
                    <span className="whitespace-nowrap">
                      Share: {((datum.value / totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              />
            </div>
            {/* ========================================================= */}
            {/* Custom Legends | Category Type*/}
            {/* ========================================================= */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categoryTypeData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-background-secondary-hover px-2 py-1 rounded-md"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white text-sm">{item.label}</span>
                  <span>{((item.value / totalRevenue) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>)}
        </div>
      )}
    </section>
  );
};

export default SellByCategory;

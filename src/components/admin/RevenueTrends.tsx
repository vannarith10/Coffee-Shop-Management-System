import { ResponsiveBar } from "@nivo/bar";
import MonthYearPicker from "../ui/MonthYearPicker";
import { useState } from "react";
import { useGetRevenueTrends } from "../../hooks/useGetRevenueTrends";
import { DefaultRevenueTrends } from "../../utils/default-values";
import TextLoader from "../ui/TextLoader";
import { RotateCcw } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RevenueTrends = () => {
  const now = new Date();
  const formated = now.toLocaleString("km-KH", {
    year: "numeric",
    month: "numeric",
  });
  const [m, y] = formated.split("/");
  const [month, setMonth] = useState<number>(Number(m));
  const [year, setYear] = useState<number>(Number(y));

  const { data, isLoading, isError, isRefetching, refetch } = useGetRevenueTrends({
    month: month,
    year: year,
  });


  const chartData = data ?? DefaultRevenueTrends;
  const isAllZero = chartData.every((item) => item.revenue === 0);

  return (
    <section className="p-6 h-100 lg:h-120 xl:h-150 bg-background-secondary border-2 border-border rounded-lg">
      {/* ================================ */}
      {/* Title */}
      {/* ================================ */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">Revenue Trends</h3>
          <p className="text-text-secondary text-sm">
            Daily revenue distribution for the current period
          </p>
        </div>

        <MonthYearPicker
          month={month}
          year={year}
          onChange={(month, year) => {
            setMonth(month);
            setYear(year);
          }}
        />
      </div>

      {/* ================================== */}
      {/* Handle Loading */}
      {/* ================================== */}
      {(isLoading || isRefetching) && (
        <div className="h-full flex pb-10 justify-center items-center">
          <TextLoader text="Loading"/>
        </div>
      )}

      {/* =================================== */}
      {/* Handle Error */}
      {/* =================================== */}
      {isError && (
        <div className="w-full h-full pb-10 flex flex-col justify-center items-center gap-4">
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

      {/* ------------------------------- */}
      {/* Handle empty array[] */}
      {/* ------------------------------- */}
      {isAllZero && (!isLoading && !isRefetching && !isError) && (
        <div className="w-full h-full flex justify-center items-center pb-10">
          <h4 className="text-text-secondary">
            No revenue data available for <span className="font-bold text-text-primary">{months[month - 1]} {year}</span>
          </h4>
        </div>
      )}

      {/* ----------------------------- */}
      {/* Showing Data */}
      {/* ----------------------------- */}
      {!isAllZero && !isLoading && !isRefetching && !isError && (
        <ResponsiveBar
          data={chartData}
          keys={["revenue"]}
          indexBy="day"
          enableLabel={false}
          labelSkipWidth={12}
          labelSkipHeight={12}
          colors={{ scheme: "accent" }}
          theme={{
            grid: {
              line: {
                stroke: "#374151",
              },
            },
            axis: {
              ticks: {
                text: {
                  fill: "#9CA3AF", // label color6
                  fontSize: 8,
                },
              },
            },
          }}
          borderColor={{ from: "color", modifiers: [] }}
          axisBottom={{ tickSize: 0, legendOffset: 32 }}
          axisLeft={{ tickSize: 0, legendOffset: -40 }}
          margin={{ top: 50, right: 0, bottom: 100, left: 60 }}
          // -------------------------------------------
          // Tooltip
          // -------------------------------------------
          tooltip={({ value, indexValue }) => (
            <div
              className="rounded-lg backdrop-blur-xs border border-border px-3 py-2 shadow-lg"
              style={{ color: "white" }}
            >
              <p className="font-semibold whitespace-nowrap">
                ថ្ងៃទី {indexValue}
              </p>
              <p className=" whitespace-nowrap">
                ចំណូល៖{" "}
                {Number(value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                $
              </p>
            </div>
          )}
        />
      )}
    </section>
  );
};

export default RevenueTrends;

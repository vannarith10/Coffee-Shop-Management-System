import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import { useGetRevenueTrends } from "../../hooks/useGetRevenueTrends";
import { DefaultRevenueTrends } from "../../utils/default-values";
import TextLoader from "../ui/TextLoader";
import { RotateCcw } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

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
  const [value, setValue] = useState<Dayjs>(dayjs());
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  useEffect(() => {
    if (!value) return;
    (() => {
      setMonth(value?.month() + 1);
      setYear(value?.year());
    })();
  }, [value]);

  const { data, isLoading, isError, isRefetching, refetch } =
    useGetRevenueTrends({
      month: month,
      year: year,
    });

  const chartData = data ?? DefaultRevenueTrends;
  const isAllZero = chartData.every((item) => item.revenue === 0);

  return (
    <section className="p-6 h-100 lg:h-120 xl:h-150 bg-background-secondary border-2 border-border rounded-lg overflow-y-hidden">
      {/* ================================ */}
      {/* Title */}
      {/* ================================ */}
      <div className="flex flex-col gap-4 sm:flex-row justify-between items-start">
        <div>
          <h3 className="text-sm sm:text-lg md:text-sm lg:text-lg xl:text-xl font-bold">
            Revenue Trends
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm md:text-xs lg:text-sm xl:text-lg">
            Daily revenue distribution for the current period
          </p>
        </div>


        {/* --------------------------- */}
        {/* Date picker */}
        {/* --------------------------- */}
        <div className="flex gap-2">
          <button
            onClick={() => setMonthOpen(true)}
            className="px-4 py-2 text-xs sm:text-sm border border-border rounded-md cursor-pointer hover:bg-background-secondary-hover"
          >
            {value.format("MMMM")}
          </button>
          <button
            onClick={() => setYearOpen(true)}
            className="px-4 py-2 text-xs sm:text-sm border border-border rounded-md cursor-pointer hover:bg-background-secondary-hover"
          >
            {value.format("YYYY")}
          </button>
          <button
            onClick={() => setValue(dayjs())}
            className="px-4 py-2 text-xs sm:text-sm border border-border rounded-md cursor-pointer hover:bg-background-secondary-hover"
          >
            Now
          </button>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* MONTH */}
          <DatePicker
            open={monthOpen}
            onClose={() => setMonthOpen(false)}
            views={["month"]}
            value={value}
            onChange={(newValue) => {
              if (newValue) {
                setValue(value.month(newValue.month()));
              }
              setMonthOpen(false);
            }}
            slotProps={{
              textField: { sx: { display: "none" } },
            }}
          />

          {/* YEAR */}
          <DatePicker
            open={yearOpen}
            onClose={() => setYearOpen(false)}
            views={["year"]}
            value={value}
            onChange={(newValue) => {
              if (newValue) {
                setValue(value.year(newValue.year()));
              }
              setYearOpen(false);
            }}
            slotProps={{
              textField: { sx: { display: "none" } },
            }}
          />
        </LocalizationProvider>
      </div>

      {/* ================================== */}
      {/* Handle Loading */}
      {/* ================================== */}
      {(isLoading || isRefetching) && (
        <div className="h-full flex pb-10 justify-center items-center">
          <TextLoader text="Loading" />
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
      {isAllZero && !isLoading && !isRefetching && !isError && (
        <div className="w-full h-full flex justify-center items-center pb-10">
          <h4 className="text-text-secondary lg:text-xl">
            No revenue data available for{" "}
            <span className="font-bold text-text-primary shimmer shimmer-color-pink-400 shimmer-duration-1000">
              {months[month - 1]} {year}
            </span>
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
          margin={{ top: 50, right: 0, bottom: 90, left: 20 }}
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

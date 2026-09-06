// components/BusinessSummary.tsx
//
import { RotateCcw, Wallet } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { ChartColumn } from "lucide-react";
import SpotlightCard from "../animation/SpotlightCard";
import { useBusinessSummary } from "../../hooks/useBusinessSummary";
import TextLoader from "../ui/TextLoader";

export default function BusinessSummary() {
  const { summary, isLoading, isError, refetch, isRefetching } =
    useBusinessSummary();

  const cards = [
    {
      title: "Today's Revenue",
      icon: <Wallet />,
      value: "$" + Number(summary?.summary?.today_revenue?.value).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      ),
      growth: summary?.summary?.today_revenue?.growth_pct ?? 0,
    },
    {
      title: "Today Orders",
      icon: <ShoppingCart />,
      value: summary?.summary?.today_total_orders?.value,
      growth: summary?.summary?.today_total_orders?.growth_pct ?? 0,
    },
    {
      title: "Avg. Order Value",
      icon: <ChartColumn />,
      value: "$" + Number(
        summary?.summary?.today_average_order_value?.value,
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      growth: summary?.summary?.today_average_order_value?.growth_pct ?? 0,
    },
  ];

  const getGrowthColor = (value: number) =>
    value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <section className="flex flex-col gap-4">
      {/* =========================== */}
      {/* Refresh button*/}
      {/* =========================== */}
      <div className="flex justify-end items-center">
        <button
          onClick={() => refetch()}
          className="font-bold text-sm text-white items-center flex gap-2 bg-background-secondary border-2 border-border px-3 py-1 rounded-md cursor-pointer hover:bg-background-secondary-hover active:scale-90 transition-all duration-100 ease-out outline-none"
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

      {/* ========================= */}
      {/* Data */}
      {/* ========================= */}
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 `}
      >
        {cards.map((card, index) => (
          <SpotlightCard key={index} rounded="lg">
            {/* ================= */}
            {/* Card */}
            {/* ================= */}
            <div className="bg-background-secondary flex flex-col justify-center p-6 gap-2 rounded-lg border-2 border-border hover:bg-background-secondary-hover">
              {/* ------------ */}
              {/* Title & Icon */}
              {/* ------------ */}
              <div className="flex justify-between text-text-secondary">
                <h4 className="text-sm font-bold">{card.title}</h4>
                {card.icon}
              </div>
              {/* ------ */}
              {/* Amount */}
              {/* ------ */}
              <h2 className="text-2xl font-bold text-text-primary z-10">
                {isLoading && !isError && <TextLoader text="...." />}
                {!isLoading && !isError && `${card.value}`}
                {isError && "Error"}
              </h2>
              {/* -------------------- */}
              {/* Compare to yesterday */}
              {/* -------------------- */}
              <h4 className="text-xs font-semibold text-text-secondary">
                <span className={`font-bold ${getGrowthColor(card.growth)}`}>
                  {!isLoading &&
                    !isError &&
                    `${card.growth >= 0 ? "+" : ""}${card.growth}%`}
                </span>
                <span> vs yesterday</span>
              </h4>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

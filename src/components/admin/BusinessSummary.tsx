// components/BusinessSummary.tsx
//
import { Wallet } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { ChartColumn } from "lucide-react";
import { useEffect, useState } from "react";
import { getBusinessSummary } from "../../services/admin.service";
import SpotlightCard from "../animation/SpotlightCard";

interface BusinessSummaryResponse {
  summary: {
    today_revenue: {
      value: number;
      growth_pct: number;
    };
    today_total_orders: {
      value: number;
      growth_pct: number;
    };
    today_average_order_value: {
      value: number;
      growth_pct: number;
    };
  };
}

export default function BusinessSummary() {
  const [summary, setSummary] = useState<BusinessSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data: BusinessSummaryResponse = await getBusinessSummary();
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Handle loading UI
  if (loading) {
    return (
      <section className="w-full h-30 bg-background-secondary grid grid-cols-2 md:grid-cols-3 gap-4 rounded-md"></section>
    );
  }

  const cards = [
    {
      title: "Today's Revenue",
      icon: <Wallet />,
      value: `$${summary?.summary?.today_revenue?.value ?? "Error"}`,
      growth: summary?.summary?.today_revenue?.growth_pct ?? 0,
    },
    {
      title: "Total Orders",
      icon: <ShoppingCart />,
      value: summary?.summary?.today_total_orders?.value ?? "Error",
      growth: summary?.summary?.today_total_orders?.growth_pct ?? 0,
    },
    {
      title: "Avg. Order Value",
      icon: <ChartColumn />,
      value: `$${summary?.summary?.today_average_order_value?.value ?? "Error"}`,
      growth: summary?.summary?.today_average_order_value?.growth_pct ?? 0,
    },
  ];

  const getGrowthColor = (value: number) =>
    value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <section
      className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 `}
    >
      {cards.map((card, index) => (
        <SpotlightCard key={index} rounded="lg">
          <div className="h-30 bg-background-secondary flex flex-col justify-center p-4 gap-2 rounded-lg border-2 border-border hover:bg-background-secondary-hover">
            <div className="flex justify-between text-text-secondary">
              <h4 className="text-sm font-bold">{card.title}</h4>
              {card.icon}
            </div>

            <h2 className="text-2xl font-bold text-text-primary z-10">
              {card.value}
            </h2>

            <h4 className="text-xs font-semibold text-text-secondary">
              <span className={`${getGrowthColor(card.growth)} font-bold`}>
                {card.growth >= 0 ? "+" : ""}
                {card.growth}%
              </span>{" "}
              vs yesterday
            </h4>
          </div>
        </SpotlightCard>
      ))}
    </section>
  );
}

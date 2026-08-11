// components/CategoryStatus.tsx
//
import {
  ChartColumnStacked,
  Croissant,
  CupSoda,
  ShieldAlert,
} from "lucide-react";
import TextLoader from "../ui/TextLoader";
import SpotlightCard from "../animation/SpotlightCard";
import { useCategoryStatusSummary } from "../../hooks/useCategoryStatusSummary";
import type { JSX } from "react/jsx-runtime";
//
// Showing the numbers on the top of Category Tab
//
export default function CategoryStatus() {
  const { statusSummary, isLoading, isError, isRefetching, refetch } =
    useCategoryStatusSummary();

  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* =============================== */}
      {/* Loading */}
      {/* =============================== */}
      {isLoading &&
        !isError &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border"
          >
            <div className="flex justify-between">
              {/* Title & Icon*/}
              <h3 className="text-text-secondary w-full h-3 font-semibold text-sm bg-gray-400"></h3>
            </div>
            {/* Value */}
            <h2 className={`font-extrabold text-4xl`}>
              {isLoading ? <TextLoader text="..." /> : "..."}
            </h2>
            {/* Description */}
            <p className="h-3 w-full bg-gray-400 text-text-secondary font-semibold"></p>
          </div>
        ))}

      {/* ======================== */}
      {/* Error */}
      {/* ======================== */}
      {isError &&
        !isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border"
          >
            <div className="flex justify-between">
              {/* Title & Icon*/}
              <h3 className="font-semibold text-sm">Error</h3>
            </div>
            {/* Value */}
            <h2 className={`font-extrabold text-4xl text-text-error`}>Error</h2>
            {/* Description */}
            <p className="text-text-secondary font-semibold">Error</p>
          </div>
        ))}


      {/* ================================ */}
      {/* Renders Cards */}
      {/* ================================ */}
      {!isLoading &&
        !isError &&
        Object.entries(statusSummary ?? {}).map(([key, value]) => {
          const config = ItemMap[key];
          return (
            <SpotlightCard key={key} rounded="lg">
              <div
               className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border">
                <div className="flex justify-between">
                  {/* Title & Icon*/}
                  <h3 className="text-text-secondary font-semibold text-sm">
                    {config.label}
                  </h3>
                  {config.icon}
                </div>
                {/* Value */}
                <h2
                  className={`font-extrabold text-4xl z-10 ${config.text_color}`}
                >
                  {isLoading ? <TextLoader text="..." /> : value}
                </h2>
                {/* Description */}
                <p className="text-xs text-text-secondary font-semibold">
                  {config.description}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
    </section>
  );
}

const ItemMap: Record<string, ColorConfig> = {
  total_categories: {
    label: "Total Categories",
    text_color: "text-white",
    icon: <ChartColumnStacked />,
    description: "Active classifications",
  },
  total_drinks: {
    label: "Total Drinks",
    text_color: "text-blue-600",
    icon: <CupSoda />,
    description: "Beverage types",
  },
  total_foods: {
    label: "Total Foods",
    text_color: "text-yellow-600",
    icon: <Croissant />,
    description: "Edible items",
  },
  total_disables: {
    label: "Total Disables",
    text_color: "text-text-error",
    icon: <ShieldAlert />,
    description: "Ingredient shortage",
  },
};

interface ColorConfig {
  label: string;
  text_color: string;
  icon: JSX.Element;
  description: string;
}

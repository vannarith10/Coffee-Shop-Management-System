//
// pages/admin/AdminDashboard.tsx
//
import BusinessSummary from "../../components/admin/BusinessSummary";
import TopSellingProducts from "../../components/admin/TopSellingProducts";
import StockStatus from "../../components/admin/StockStatus";
import ScrollToTheTop from "../../components/ScrollToTheTop";

export default function AdminDashboard() {
  return (
    <div className="w-full h-full p-4 overflow-y-scroll scrollbar-hide">
      <h2 className="text-xl md:text-4xl font-extrabold text-text-primary">
        Business Analytics
      </h2>
      <p className="text-text-secondary mb-4 text-xs md:text-sm">
        Overview of coffee shop performance.
      </p>
      <ScrollToTheTop/>
      <BusinessSummary />
      <TopSellingProducts />
      <StockStatus />
    </div>
  );
}

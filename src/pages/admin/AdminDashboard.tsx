// pages/admin/AdminDashboard.tsx
//
import BusinessSummary from "../../components/BusinessSummary"
import TopSellingProducts from "../../components/TopSellingProducts"
import StockStatus from "../../components/StockStatus"

export default function AdminDashboard () {


    return (
        <div className="w-full h-full mt-20 md:mt-0 p-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-text-primary">Business Analytics</h2>
            <p className="text-text-secondary mb-4 text-xs md:text-sm">Overview of coffee shop performance.</p>
            <BusinessSummary/>
            <TopSellingProducts/>
            <StockStatus/>
        </div>
    )
}
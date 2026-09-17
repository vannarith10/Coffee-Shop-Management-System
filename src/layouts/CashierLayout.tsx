import Navbar from "@/features/cashier/components/Navbar";
import { Outlet } from "react-router-dom";

const CashierLayout = () => {
  return (
    <div className="h-screen max-h-screen overflow-hidden">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default CashierLayout;

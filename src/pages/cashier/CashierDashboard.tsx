// pages/cashier/CashierDashboard.tsx
//
import CheckoutPanel from "../../components/cashier/CheckoutPanel";
import Menu from "../../components/cashier/Menu";
import MenuFilter from "../../components/cashier/MenuFilter";

export default function CashierDashboard() {
  return (
    <div className="w-screen h-full overflow-y-scroll scrollbar-hide flex flex-col md:flex-row pt-20 ">
      <div className=" w-full md:w-1/2 lg:w-3/5 xl:w-2/3 md:overflow-y-scroll scrollbar-hide ">
        <MenuFilter/>
        <Menu />
      </div>
      <div className="h-full w-full md:w-1/2 lg:w-2/5 xl:w-1/3">
        <CheckoutPanel/>
      </div>
    </div>
  );
}

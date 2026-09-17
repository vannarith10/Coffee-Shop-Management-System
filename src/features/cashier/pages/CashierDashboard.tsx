import CheckoutPanel from "@/features/cashier/components/CheckoutPanel";
import Menu from "@/features/cashier/components/Menu";
import MenuFilter from "@/features/cashier/components/MenuFilter";

export default function CashierDashboard() {
  return (
    <div className="w-screen h-full overflow-y-scroll scrollbar-hide flex flex-col md:flex-row ">
      <div className=" w-full md:w-1/2 lg:w-3/5 xl:w-2/3 md:overflow-y-scroll scrollbar-hide pt-20 ">
        <MenuFilter />
        <Menu />
      </div>
      <div className="h-full w-full md:w-1/2 lg:w-2/5 xl:w-1/3 pt-20 ">
        <CheckoutPanel />
      </div>
    </div>
  );
}

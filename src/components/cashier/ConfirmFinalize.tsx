import Waiting from "./Waiting";
import { RotateCw } from "lucide-react";
import { useGetOrderInfo } from "../../hooks/cashier/useGetOrderInfo";
import { useNavigate } from "react-router-dom";
import { useConfirmOrder } from "../../hooks/cashier/useConfirmOrder";
import { toast } from "sonner";
import useCartStore from "../../hooks/cashier/useCartStore";


const ConfirmFinalize = ({ id }: { id: string }) => {
  const { data, isLoading, isError, refetch, isFetching } = useGetOrderInfo(
    id!,
  );
  const { mutate: confirmOrder, isPending: isConfirming } = useConfirmOrder();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  function handleConfirmOrder() {
    confirmOrder(id, {

      onError: (error) => {
        toast.error(`${error.response?.data.detail}`, {
          duration: 3000,
          id: "confirm-order-error",
        });
      },

      onSuccess: () => {
        toast.success("Order confirmed and sent!", {
          duration: 5000,
          id: "confirm-order-success",
        });
        clearCart();
        setTimeout(() => navigate("/cashier"), 1000);
      },
    });
  }

  // Loading handling
  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full bg-background-secondary rounded-xl flex flex-col gap-6 p-10 justify-center items-center border-2 border-border">
        <div className="w-full flex relative py-10">
          <Waiting />
        </div>

        <h2 className="font-bold text-4xl uppercase text-transparent shimmer shimmer-bg shimmer-color-background-secondary-hover border border-border">
          Finalize Order
        </h2>

        <p className="font-semibold text-sm text-transparent text-center shimmer shimmer-bg shimmer-color-background-secondary-hover border border-border">
          Confirm receipt of{" "}
          <span className="text-transparent font-bold text-lg">${"00"}</span>{" "}
          and send order{" "}
          <span className="text-transparent font-bold text-lg">#{"0000"}</span>{" "}
          to barista station.
        </p>

        <button className="uppercase text-transparent shimmer shimmer-bg shimmer-color-background-secondary-hover border border-border py-10 px-20 text-sm lg:text-xl font-bold rounded-lg cursor-pointer active:scale-80 outline-none transition-all duration-300 ease-out">
          Confirm & Send to Barista
        </button>
      </div>
    );
  }

  // Error handling
  if (isError) {
    return (
      <div className="w-full h-full bg-background-secondary rounded-xl flex flex-col gap-6 justify-center items-center border-2 border-border">
        <button
          onClick={() => refetch()}
          className="bg-background-secondary-hover flex gap-2 items-center py-4 px-20 text-sm lg:text-xl font-semibold rounded-lg cursor-pointer active:scale-80 outline-none transition-all duration-300 ease-out"
        >
          Try Again <RotateCw />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background-secondary rounded-xl flex flex-col gap-6 py-10 justify-center items-center border-2 border-border">
      <div className="w-full flex relative py-10 ">
        <Waiting />
      </div>

      <h2 className="font-bold text-4xl uppercase">Finalize Order</h2>
      <p className="font-semibold text-sm text-text-secondary text-center">
        Confirm receipt of{" "}
        <span className="text-green-600 font-bold text-lg">
          ${data?.total_price}
        </span>{" "}
        and send order{" "}
        <span className="text-indigo-400 font-bold text-lg">
          #{data?.order_number}
        </span>{" "}
        to barista station.
      </p>

      <button
        onClick={handleConfirmOrder}
        className="shimmer shimmer-bg shimmer-color-green-600 shimmer-duration-1500 uppercase bg-green-600/30 hover:bg-green-600/70 py-10 px-20 text-sm lg:text-xl font-bold rounded-lg cursor-pointer active:scale-80 outline-none transition-all duration-300 ease-out"
      >
        {isConfirming ? "Confirming..." : "Confirm & Send to Barista"}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="font-semibold text-text-error cursor-pointer hover:underline underline-offset-4 active:scale-80 transition-all duration-200 ease-out"
      >
        Cancel
      </button>
    </div>
  );
};

export default ConfirmFinalize;

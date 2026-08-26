import { BadgeDollarSign, ChevronsDown, QrCode, Receipt } from "lucide-react";
import type { PaymentMethod } from "../../types/order";
import type { ReactNode } from "react";
import { useGetOrderInfo } from "../../hooks/cashier/useGetOrderInfo";
import { useNavigate } from "react-router-dom";

interface PaymentMethodOption {
  value: PaymentMethod;
  label: ReactNode;
}

const PaymentMethods: PaymentMethodOption[] = [
  {
    value: "CASH",
    label: <Receipt size={36} />,
  },
  {
    value: "QR",
    label: <QrCode size={36} />,
  },
];

const ConfirmSummary = ({ id }: { id: string }) => {
  const { data, isLoading, isError, error, isFetching } = useGetOrderInfo(id!);
  const navigate = useNavigate();

  const paymentMethod = data?.payment_method;
  const totalPrice = data?.total_price;

  // Loading handling
  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full bg-background-secondary rounded-xl p-10 border-2 border-border">
        <div className="w-full flex items-center justify-start ">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <BadgeDollarSign /> Payment Summary
          </h3>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-4 mt-10">
          <h4 className=" uppercase font-bold text-sm text-text-secondary">
            Payment Method
          </h4>
          <div className="flex gap-4 w-full">
            {PaymentMethods.map((_, i) => {
              return (
                <div
                  key={i}
                  className="shimmer shimmer-bg shimmer-color-background-secondary-hover border border-border w-full aspect-square rounded-lg"
                ></div>
              );
            })}
          </div>
        </div>

        {/* Total price */}
        <div className="flex flex-col gap-4 mt-10">
          <h4 className=" uppercase font-bold text-sm text-text-secondary">
            Total Price
          </h4>
          <div className="shimmer shimmer-bg shimmer-color-background-secondary-hover border border-border rounded-lg w-full flex justify-center items-center py-10"></div>
        </div>
      </div>
    );
  }

  // Error handling
  if (isError) {
    return (
      <div className="w-full h-full bg-background-secondary rounded-xl p-10 flex flex-col justify-center items-center border-2 border-border">
        <h3 className="font-bold text-foreground/40 text-xl shimmer shimmer-color-orange-500">
          Something went wrong
        </h3>
        <div className="w-full flex flex-col gap-2 justify-center items-start mt-10 p-4 bg-background-secondary-hover rounded-lg">
          {/* Status code */}
          <p className="font-semibold text-sm">
            <span className="font-bold text-amber-500 ">Status Code: </span>
            {error.response?.data.status}
          </p>
          {/* Error message */}
          <p className="font-semibold text-sm">
            <span className="font-bold text-amber-500 ">Error Message: </span>
            {error.response?.data.message}
          </p>
          {/* Error detail */}
          <p className="font-semibold text-sm">
            <span className="font-bold text-amber-500 ">Error Detail: </span>
            {error.response?.data.detail}
          </p>
        </div>

        <div className="w-full flex justify-center py-10 items-center">
          <button
            onClick={() => navigate("/cashier", { replace: true })}
            className="flex font-semibold text:sm lg:text-lg gap-2 items-center justify-center px-10 py-5 bg-background-secondary-hover cursor-pointer rounded-lg active:scale-80 outline-none transition-all duration-300 ease-out"
          >
            Back <ChevronsDown />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background-secondary rounded-xl p-10">
      <div className="w-full flex items-center justify-start ">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <BadgeDollarSign /> Payment Summary
        </h3>
      </div>

      {/* Payment Method */}
      <div className="flex flex-col gap-4 mt-10">
        <h4 className=" uppercase font-bold text-sm text-text-secondary">
          Payment Method
        </h4>
        {/* payment method */}
        <div className="flex gap-4 w-full">
          {PaymentMethods.map((payment) => {
            const selectedPaymentMethod = payment.value === paymentMethod;
            return (
              <div
                key={payment.value}
                className={`${selectedPaymentMethod ? "shimmer shimmer-bg shimmer-color-green-600 shimmer-duration-2000 bg-green-600/50 border border-green-600" : "bg-background-secondary-hover"} w-full aspect-square flex justify-center items-center rounded-lg`}
              >
                <span className="font-bold text-sm md:text-lg xl:text-2xl flex flex-col lg:flex-row items-center gap-2">
                  {payment.label} {payment.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total price */}
      <div className="flex flex-col gap-4 mt-10">
        <h4 className=" uppercase font-bold text-sm text-text-secondary">
          Total Price
        </h4>
        <div className="bg-background-secondary-hover rounded-lg w-full flex justify-center items-center py-10">
          <span className="font-bold shimmer text-green-600 text-4xl">
            ${totalPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSummary;

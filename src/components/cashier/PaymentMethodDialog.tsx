//
import { motion } from "framer-motion";
import { QrCode, Receipt, Send, X } from "lucide-react";
import useCartStore from "../../hooks/cashier/useCartStore";
import { useState, type ReactNode } from "react";
import DefaultImage from "../../assets/image-default.jpg";
import { toast } from "sonner";
import { useCreateOrder } from "../../hooks/cashier/useCreateOrder";
import type { CreateOrderRequest } from "../../types/order";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  note: string | null;
}

type PaymentMethod = "CASH" | "BAKONG";
interface PaymentOption {
  value: string;
  label: ReactNode;
}

const PaymentOptions: Record<PaymentMethod, PaymentOption> = {
  CASH: {
    value: "cash",
    label: <Receipt size={48} />,
  },
  BAKONG: {
    value: "bakong",
    label: <QrCode size={48} />,
  },
};

const PaymentMethodDialog = ({ onClose, note }: Props) => {
  const { mutate: createCashOrder } = useCreateOrder();

  const cart = useCartStore((state) => state.cart);
  const { getTotalPrice, getTotalQuantity } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const navigate = useNavigate();

  // Create Order
  function handlePlaceOrder() {
    // At least has one item
    if (cart.length < 1 || cart.length == 0) {
      toast.error("No item to order", { duration: 3000, id: "No-Order-Item" });
      return;
    }

    // ===> Cash Order
    if (paymentMethod === "CASH") {
      const request: CreateOrderRequest = {
        note: note ?? null,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          customization: "",
        })),
      };

      createCashOrder(request, {
        onSuccess: (res) => {
          toast.success("Order created", {
            duration: 3000,
            id: "Order-Created",
          });

          navigate(`confirm-order/${res.order_id}`);
          onClose();
        },
      });
    }

    // ===> QR Order
    if (paymentMethod === "BAKONG") {
      toast.error("QR payment comming soon...", { duration: 5000 });
      return;
    }
  }

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
        duration: 0.5,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 1,
        },
      }}
      className="fixed z-99 inset-0 backdrop-blur-lg py-40 flex justify-center items-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        //
        initial={{
          opacity: 1,
          x: 500,
          y: 480,
          rotateY: 20,
          rotateZ: 20,
          skewY: 50,
          scaleX: 0.5,
          scaleY: 0.1,
          borderRadius: 1000,
        }}
        //
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          skewY: 0,
          skewX: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: 30,
        }}
        //
        exit={{
          opacity: 1,
          x: 800,
          y: 800,
          skewY: 50,
          scaleX: 0.2,
          scaleY: 0.01,
          borderRadius: 500,
          transition: {
            duration: 1,
          },
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 16,
        }}
        style={{
          transformOrigin: "left center",
          transformPerspective: 1500,
        }}
        className="h-[80vh] max-w-[90vw] aspect-4/3 bg-background-secondary border-2"
      >
        {/* =========================== */}
        {/* Children elements stay here */}
        {/* =========================== */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0,
            },
          }}
          className="w-full h-full flex flex-col "
        >
          {/* -------------------------- */}
          {/* Header */}
          {/* -------------------------- */}
          <div className="flex justify-between items-center border-b border-border p-6 ">
            <h2 className="font-bold text-xl">Choose Payment Method</h2>
            <button
              onClick={onClose}
              className="hover:bg-gray-600 rounded-full"
            >
              <X size={28} />
            </button>
          </div>

          {/* ---------------------- */}
          {/* ---------------------- */}
          {/* Content */}
          {/* ---------------------- */}
          {/* ---------------------- */}
          <div className="w-full h-full flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
            {/* ================================================= */}
            {/* summary */}
            {/* ================================================= */}
            <div className="w-full h-full md:w-2/5 flex flex-col ">
              <label
                htmlFor="order summary"
                className="font-bold uppercase text-xs text-text-secondary"
              >
                Order Summary
              </label>
              {/* ------- */}
              {/* Summary */}
              {/* ------- */}
              <div className="mt-4 w-full px-4 py-2 rounded-lg bg-background-secondary-hover ">
                {/* Total amount */}
                <div className="flex justify-between items-center ">
                  <span className="font-semibold text-sm text-text-secondary">
                    Total Price
                  </span>
                  <span className="font-bold text-2xl text-green-400">
                    ${getTotalPrice()}
                  </span>
                </div>
                {/* Total items */}
                <div className="flex justify-between items-center ">
                  <span className="font-semibold text-sm text-text-secondary">
                    Total Items
                  </span>
                  <span className="font-bold text-lg text-green-400">
                    {cart.length}
                  </span>
                </div>
                {/* Total units */}
                <div className="flex justify-between items-center  ">
                  <span className="font-semibold text-sm text-text-secondary">
                    Total Units
                  </span>
                  <span className="font-bold text-lg text-green-400">
                    {getTotalQuantity()}
                  </span>
                </div>
              </div>
              {/* --------------------------------- */}
              {/* items summary */}
              {/* --------------------------------- */}
              <div className="mt-4 flex flex-col gap-2 w-full h-full overflow-y-scroll scrollbar-hide border-t border-border pt-4">
                {cart.map((item) => {
                  const totalPricePerItem = (
                    item.price * item.quantity
                  ).toFixed(2);
                  return (
                    <div className="border border-border p-2 flex gap-2 w-full justify-between rounded-md">
                      <div className="flex gap-2">
                        <div className="aspect-square w-10 max-w-10">
                          <img
                            src={item.image_url || DefaultImage}
                            alt="product image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between">
                          <span className="text-xs font-bold">{item.name}</span>
                          <span className="font-bold text-sm text-amber-600">
                            ${item.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-2 ">
                        {/* item units */}
                        <span className="font-bold text-sm lowercase">
                          {item.quantity} {item.quantity > 1 ? "Units" : "Unit"}
                        </span>
                        {/* total price of an item */}
                        <span className="font-bold text-green-600">
                          ${totalPricePerItem}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================================================== */}
            {/* payment options */}
            {/* =================================================== */}
            <div className="w-full md:w-3/5 h-full flex flex-col md:border-l border-border md:pl-6 ">
              <label
                htmlFor="payment method"
                className="font-bold uppercase text-xs text-text-secondary"
              >
                Payment Method
              </label>

              {/* ------------------------------------ */}
              {/* Payment option buttons */}
              {/* ------------------------------------ */}
              <div className="flex flex-col justify-between gap-4 h-full w-full">
                <div className="mt-4 w-full flex gap-4">
                  {Object.entries(PaymentOptions).map(([key, value]) => {
                    const isSelected = key === paymentMethod;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          setPaymentMethod((prev) =>
                            prev != key ? (key as PaymentMethod) : null,
                          )
                        }
                        className={`w-1/2 flex flex-col items-center justify-center ${isSelected ? "bg-green-600" : ""} aspect-square gap-2 border-2 border-border hover:border-border-hover rounded-lg cursor-pointer outline-none active:scale-80 transition-all duration-500 ease-out `}
                      >
                        {value.label}
                        <span className="font-bold uppercase">
                          {value.value}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ----------------------------- */}
                {/* Button place order & Note */}
                {/* ----------------------------- */}
                <div className="flex flex-col gap-6">
                  {note && (
                    <textarea
                      name="note"
                      id="note"
                      rows={3}
                      readOnly={true}
                      disabled={true}
                      value={note}
                      className="border-2 border-border rounded-md p-2 text-text-secondary"
                    ></textarea>
                  )}

                  {/* button Place Order */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={paymentMethod == null}
                    className={`${paymentMethod !== null ? "bg-green-600 hover:bg-green-700 active:scale-80 cursor-pointer" : "bg-gray-500 cursor-not-allowed"} w-full flex items-center justify-center gap-2 py-6 rounded-lg font-bold text-lg outline-none transition-all duration-200 ease-out`}
                  >
                    Place Order
                    <Send />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentMethodDialog;

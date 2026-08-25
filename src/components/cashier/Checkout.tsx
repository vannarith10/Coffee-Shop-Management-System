//
// components/cashier/Checkout.tsx
//
// Display the checkout information under checkout items
//
import { useState } from "react";
import useCartStore from "../../hooks/cashier/useCartStore";
import PaymentMethodDialog from "./PaymentMethodDialog";
import { AnimatePresence } from "framer-motion";

const Checkout = () => {
  const cart = useCartStore((state) => state.cart);
  const hasItem = cart.length > 0;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const [note, setNote] = useState<string>("");
  const [checkedout, setCheckedout] = useState(false);

  const onClose = () => {
    setCheckedout(false);
  };

  return (
    <div className="p-4 bg-background-secondary ">
      {/* ------------------------ */}
      {/* Order Note */}
      {/* ------------------------ */}
      <div className="flex flex-col gap-1">
        <label htmlFor="order note" className="text-xs font-bold">
          Order Note
        </label>
        <textarea
          disabled={!hasItem}
          value={note}
          placeholder="Add spacial instructions..."
          name="order note"
          id=""
          rows={hasItem ? 2 : 1}
          onChange={(e) => setNote(e.target.value)}
          className={`placeholder:text-sm text-sm p-2 ${hasItem ? "border-border-hover hover:border-border-hover" : "border-gray-600"} border  bg-background-secondary rounded-md outline-none scrollbar-hide focus:border-green-600 `}
        ></textarea>
      </div>
      {/* -------------------------------- */}
      {/* Total price & items */}
      {/* -------------------------------- */}
      <div>
        {/* total items */}
        <h3 className="mt-4 flex justify-between items-center text-sm font-semibold">
          <span>Total Items</span>
          <span>{cart.length}</span>
        </h3>
        {/* total units */}
        <h3 className="flex justify-between items-center text-sm font-semibold">
          <span>Total Units</span>
          <span>{totalQuantity}</span>
        </h3>
        {/* total price */}
        <h3 className="mt-4 flex justify-between items-center text-lg font-semibold">
          <span>Total Price</span>
          <span className="text-green-600 text-xl font-bold">
            ${totalPrice}
          </span>
        </h3>
      </div>
      {/* button checkout */}
      <button
        disabled={!hasItem}
        onClick={() => setCheckedout(true)}
        className={`mt-2 w-full ${hasItem ? "bg-green-600 hover:bg-green-700 cursor-pointer active:scale-80" : "bg-gray-500 cursor-not-allowed"} py-3 rounded-md font-bold text-lg outline-none transition-all duration-200 ease-out`}
      >
        Checkout
      </button>

      {/* ========================= */}
      {/* Payment method dialog box */}
      {/* ========================= */}
      <AnimatePresence>
        {checkedout && <PaymentMethodDialog onClose={onClose} note={note}/>}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;

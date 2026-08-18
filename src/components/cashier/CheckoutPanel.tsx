import { ClockFading, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import useCartStore from "../../hooks/cashier/useCartStore";
import DefaultImage from "../../assets/image-default.jpg";
import { CATEGORY_COLOR_CONFIG } from "../../types/category";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Checkout from "./Checkout";

// style header buttons
const myBtn = `text-white flex gap-2 items-center justify-center px-4 py-2 w-full rounded-md font-bold text-sm active:scale-80 transition-all duration-300 ease-out outline-none`;

const CheckoutPanel = () => {
  const cart = useCartStore((state) => state.cart);
  const { increase, decrease, clearCart, removeFromCart } = useCartStore();
  const hasItem = cart.length > 0;

  // Scroll to item
  const itemRef = useRef<HTMLDivElement | null>(null);
  const prevLength = useRef<number>(cart.length);
  const scrollToLastItem = () => {
    if (itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // Active scrolling
  useEffect(() => {
    if (cart.length > prevLength.current) {
      scrollToLastItem();
    }
    prevLength.current = cart.length;
  }, [cart]);

  return (
    <section className="scrollbar-hide h-full flex flex-col justify-between overflow-y-scroll w-full border-l border-border">
      {/* ============================ */}
      {/* Checkout header */}
      {/* ============================ */}
      <div className="p-4  flex flex-col gap-4 border-t md:border-t-0 border-b border-border">
        <h3 className="font-bold text-lg">Current Order</h3>
        <div className="w-full flex gap-4 ">
          {/* Button history */}
          <button
            className={`${myBtn} bg-background-secondary-hover cursor-pointer`}
          >
            <ClockFading size={16} /> History
          </button>
          {/* Button clear cart */}
          <button
            disabled={!hasItem}
            onClick={clearCart}
            className={` ${hasItem ? `bg-text-error ${myBtn} cursor-pointer` : `bg-gray-600 ${myBtn} cursor-not-allowed `} `}
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* Checkout Items */}
      {/* ============================= */}

      <div className="h-full min-h-20 max-h-full flex flex-col gap-2 p-2 justify-start overflow-y-scroll scrollbar-hide ">
        <AnimatePresence mode="sync">
          {cart.map((item, idx) => {
            const colorConfig = CATEGORY_COLOR_CONFIG[item.category_type];
            const isLastItem = idx === cart.length - 1;
            return (
              <motion.div
                key={item.id}
                ref={isLastItem ? itemRef : null}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -20, x: -100 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                transition={{
                  layout: {
                    // For exit
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  },
                  // For entrance
                  type: "spring",
                  stiffness: 200,
                  damping: 10,

                  opacity: {
                    duration: 0.3,
                  },
                }}
                exit={{
                  opacity: 1,
                  x: 600,
                  transition: {
                    duration: 0.4,
                  },
                }}
                className="h-20 max-h-20 w-full  bg-background-secondary/50 hover flex items-center gap-2 border-2 border-border-hover rounded-xl p-2 outline-none"
              >
                {/* -------------------------------------- */}
                {/* Item Image */}
                {/* -------------------------------------- */}
                <div className="h-full aspect-square">
                  <img
                    src={item.image_url || DefaultImage}
                    alt="product image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {/* ------------------------------------------------- */}
                {/* Item detail container | right side */}
                {/* ------------------------------------------------- */}
                <div className="h-full w-full flex items-center gap-2 justify-between">
                  {/* ------------------------------------ */}
                  {/* Item profile */}
                  {/* ------------------------------------ */}
                  <div className="w-full ">
                    <h2 className="font-bold text-sm">{item.name}</h2>
                    {/* Category Type */}
                    <span
                      className={`font-bold text-[8px] px-2 py-1 rounded-sm ${colorConfig.bgColor}`}
                    >
                      {item.category_type}
                    </span>
                    {/* Category Name */}
                    <span className="ml-2 font-bold text-[8px] px-2 py-1 rounded-sm bg-background-secondary">
                      {item.category_name}
                    </span>
                  </div>
                  {/* ------------------------------------- */}
                  {/* Item amount management */}
                  {/* ------------------------------------- */}
                  <div className="w-full flex gap-1 items-center justify-end ">
                    {/* button decrease */}
                    <button
                      onClick={() => decrease(item.id)}
                      className="p-1 rounded-full bg-background-secondary hover:bg-background-secondary-hover hover:scale-110 active:scale-80 outline-none transition-all duration-100 "
                    >
                      <Minus size={16} />
                    </button>
                    {/* item amount */}
                    <span className="px-4 font-bold text-sm rounded-md bg-background-secondary-hover">
                      {item.quantity}
                    </span>
                    {/* button increase */}
                    <button
                      onClick={() => increase(item.id)}
                      className="p-1 rounded-full bg-background-secondary hover:bg-background-secondary-hover hover:scale-110 active:scale-80  outline-none transition-all duration-100 "
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {/* ---------------------------- */}
                  {/* item price */}
                  {/* ---------------------------- */}
                  <div className="h-full flex flex-col gap-2 items-end justify-center ">
                    <span className=" font-bold text-xs text-white bg-red-500 px-2 rounded-sm">
                      ${item.price}
                    </span>
                    <span className="font-bold text-sm text-white bg-green-600 px-2 rounded-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  {/* Button remove from card */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-amber-500 p-2 rounded-full text-white hover:bg-amber-600 cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ====================================== */}
      {/* Check out */}
      {/* ====================================== */}
      <Checkout />
    </section>
  );
};

export default CheckoutPanel;

//
// Card of Order
//
import type { BaristaOrderItem } from "../../types/barista/order";
import { formatDateTime } from "../../utils/dateFormatter";

interface Props {
  order: BaristaOrderItem;
  onClick: () => void;
  buttonText: string;
  onCancel: () => void;
}

const BorderColor = {
  QUEUED: "border-gray-400",
  PREPARING: "border-amber-500",
  DONE: "border-green-500",
  CANCELLED: "border-red-600",
} as const;

const OrderCard = ({ order, onClick, buttonText, onCancel }: Props) => {
  return (
    <div
      className={`border ${BorderColor[order.status]} ${order.status === "PREPARING" && "shimmer shimmer-bg shimmer-color-blue-300 shimmer-duration-3000"} pb-4 rounded-xl overflow-hidden hover:bg-background-secondary-hover hover:-translate-y-2 transition-all duration-300 ease-out`}
    >
      {/* header */}
      <h3 className="flex flex-col justify-between items-start py-4 px-4 bg-sidebar">
        <div className="w-full flex justify-between items-center">
          <span className="text-lg font-bold">#{order.order_number}</span>
          <span
            className={`text-xs font-bold bg-background-primary-hover px-2 py-1 rounded-md ${order.status === "PREPARING" && "shimmer shimmer-bg shimmer-color-amber-500 shimmer-duration-1000"}`}
          >
            {order.status}
          </span>
        </div>
        <span className="text-xs font-mono font-semibold">
          {formatDateTime(order.create_at)}
        </span>
      </h3>
      {/* ------------------------ */}
      {/* items */}
      {/* ------------------------ */}
      <ul className="flex flex-col gap-4 px-4">
        {order.items.map((i) => {
          return (
            <li
              key={i.item_id}
              className="flex justify-between items-center py-2 border-b border-border"
            >
              <span className="bg-white text-gray-600 font-bold flex justify-center items-center w-8 aspect-square rounded-full">
                {i.quantity}
              </span>
              <span className="font-semibold text-center">{i.name}</span>
              <img
                src={i.image_url}
                alt="item image"
                className="w-12 h-12 object-cover rounded-md border"
              />
            </li>
          );
        })}
      </ul>
      {/* Notes */}
      <div className="px-4 pt-4 ">
        <span className="font-mono font-bold uppercase text-xs">
          order notes
        </span>
        <p className="font-semibold text-sm bg-sidebar p-2">
          {order.note || "No note"}
        </p>
      </div>
      {/* Action button */}
      <div className="w-full px-4 mt-4 flex gap-2">
        {order.status !== "DONE" && (
          <button
            onClick={onCancel}
            className=" w-1/3 bg-red-500 hover:bg-red-600 active:bg-red-700 cursor-pointer active:scale-80 outline-none py-4 font-bold text-sm transition-all duration-300 ease-out"
          >
            Cancel
          </button>
        )}
        {/* -----------------------
              Action button 
        ------------------------*/}
        <button
          onClick={onClick}
          className="
                    w-2/3
                    py-4
                    font-bold text-sm
                    bg-green-600
                    cursor-pointer transition-all
                    hover:bg-green-700 active:bg-green-800 active:scale-80 outline-none duration-300 ease-out
                  "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;

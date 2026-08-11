import { useEffect } from "react";
import ConfirmSummary from "../../components/cashier/ConfirmSummary";
import ConfirmFinalize from "../../components/cashier/ConfirmFinalize";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderInfo } from "../../hooks/cashier/useGetOrderInfo";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const ConfirmOrder = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError, error } = useGetOrderInfo(id!);
  const navigate = useNavigate();


  if (isError || error) {
    toast.error(`${error.response?.data.message}`, {
      id: "get-order-error",
      duration: 3000,
    });
  }

  useEffect(() => {
    if (!data) return;

    if (data.order_status !== "CREATED") {
      toast.error("Order must be in QUEUED state", {
        duration: 3000,
        id: "order-status-invalid",
      });
      navigate("/cashier");
    }
  }, [data, navigate]);


  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 1,
          rotateY: 20,
          rotateZ: 20,
          skewY: 50,
          scaleX: 0.3,
          scaleY: 0.3,
        }}
        //
        animate={{
          opacity: 1,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          skewY: 0,
          skewX: 0,
          scaleX: 1,
          scaleY: 1,
        }}
        //
        transition={{
          duration: 1,
          ease: "easeOut",
          type: "spring",
          stiffness: 80,
          damping: 20,
        }}
        style={{
          transformOrigin: "left center",
          transformPerspective: 1500,
        }}
        className="w-full h-full z-100 fixed flex bg-background-primary p-6 gap-6"
      >
        <div className="h-full w-2/5 ">
          <ConfirmSummary id={id!} />
        </div>
        <div className="h-full w-3/5 ">
          <ConfirmFinalize id={id!} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmOrder;

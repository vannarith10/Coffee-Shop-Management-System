//
//
//
import React, { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  className?: string;
  children: ReactNode;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const MyPopupForm = ({ children, onClose, className, handleSubmit }: Props) => {
  // ---------------------------------------------------------------------
  // Blocks scrolling when open the form
  // makes sure the position not go back to the top when closing the from
  // So, the form stays still at the position we open it
  // ---------------------------------------------------------------------
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      onClick={onClose}
      className={`fixed inset-0 z-99 bg-black/10 backdrop-blur-lg flex justify-center items-center ${className}`}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
        }}
        //
        animate={{
          opacity: 1,
          scale: 1,
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
            duration: 0.5,
          },
        }}
        transition={{
          ease: "easeOut",
          type: "spring",
          stiffness: 250,
          damping: 30,
        }}
        style={{
          transformOrigin: "center",
          transformPerspective: 1500,
        }}
      >
        <form
          onSubmit={(e) => handleSubmit(e)}
          onClick={(e) => e.stopPropagation()}
          className=" overflow-y-scroll scrollbar-hide h-fit max-h-[90vh] w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] bg-background-secondary flex flex-col p-10 pt-0 gap-6 rounded-4xl border-2 border-border"
        >
          {children}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MyPopupForm;

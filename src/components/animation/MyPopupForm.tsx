import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  className?: string;
  children: React.ReactElement;
  onClose: () => void;
}

const MyPopupForm = ({ children, onClose, className }: Props) => {

  // Blocks scrolling when open the form
  // makes sure the position not go back to the top when closing the from
  // So, the form stays still at the position we open it
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
            duration: 0.5,
          },
        }}
        transition={{
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{
          transformOrigin: "left center",
          transformPerspective: 1500,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MyPopupForm;

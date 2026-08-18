import React from "react";
import { motion } from "framer-motion";

const MyDialogClose = ({ children, onClose }: { children: React.ReactElement, onClose: () => void }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      onClick={onClose}
      className="fixed inset-0 z-30 bg-black/10 backdrop-blur-lg flex justify-center items-center"
    >
      {children}
    </motion.section>
  );
};

export default MyDialogClose;

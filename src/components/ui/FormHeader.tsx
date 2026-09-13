import { X } from "lucide-react";
import React from "react";

interface Props {
  title: string;
  description?: string;
  onClose: () => void;
  className?: string;
}

const FormHeader = ({ title, onClose, className, description }: Props) => {
  return (
    <h2
      className={` bg-background-secondary flex justify-between items-center border-b border-border py-10 ${className}`}
    >
      <div className="flex flex-col">
          <span className="font-bold text-lg md:text-xl">{title ?? "Form"}</span>
          <p className="text-xs text-text-secondary">{description}</p>
      </div>

      {/* button close x */}
      <button
        type="button"
        onClick={onClose}
        className="hover:bg-gray-500/30 rounded-full p-0.5 active:scale-80 transition-all duration-300 ease-out"
      >
        <X size={28} />
      </button>
    </h2>
  );
};

export default FormHeader;

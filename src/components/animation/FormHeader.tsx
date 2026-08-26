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
      className={`flex justify-between items-center bg-background-primary border-b border-border p-6 ${className}`}
    >
      <div className="flex flex-col">
          <span className="font-bold text-lg md:text-xl">{title ?? "Form"}</span>
          <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="hover:bg-gray-600 rounded-full"
      >
        <X size={28} />
      </button>
    </h2>
  );
};

export default FormHeader;

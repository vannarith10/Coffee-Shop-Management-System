import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption<T> {
  label: string;
  value: T;
  bg?: string;
}

interface CustomSelectProps<T> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect<T>({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={selectRef}
      className={`relative w-full ${className}`}
    >
      {/* Selected value */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-md border-2 
          border-border bg-background-secondary p-2 font-bold
          transition-all hover:border-border-hover
          focus:border-green-600 focus:outline-none
          ${
            value === false
              ? "text-text-error"
              : "text-white"
          }`}
      >
        <span>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          className={`size-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Options */}
      <div
        className={`absolute left-0 top-full z-50 mt-2 w-full overflow-hidden 
          rounded-md border border-border bg-background-secondary shadow-lg
          transition-all duration-200 ${
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left
                font-medium transition hover:bg-background-secondary-hover
                ${
                  isSelected
                    ? "bg-green-600"
                    : "bg-background-primary"
                }`}
            >
              {/* Optional status indicator */}
              {option.bg && (
                <span
                  className={`size-2.5 rounded-full border-2 ${option.bg}`}
                />
              )}

              <span
                className={
                  option.value === false
                    ? "text-text-error"
                    : "text-text-primary"
                }
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
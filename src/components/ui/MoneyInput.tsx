interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  decimals?: number;
  className?: string;
  readOnly?: boolean;
}

export default function MoneyInput({
  value,
  onChange,
  decimals = 2,
  className = "w-full border-2 border-border p-2 rounded-md outline-none font-bold text-green-600",
  readOnly = false,
}: MoneyInputProps) {
  return (
    <input
      readOnly={readOnly}
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => {
        let val = e.target.value;
        // Allow only digits and dots
        val = val.replace(/[^\d.]/g, "");
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts.slice(1).join("");
        }
        // Limit to 2 decimal places
        if (val.includes(".")) {
          const [whole, decimal] = val.split(".");
          val = whole + "." + decimal.slice(0, decimals);
        }
        // Strip leading zeros, but keep a single "0" before a decimal
        val = val.replace(/^0+(?=\d)/, "");
        onChange(val);
      }}
      className={`${className}`}
    />
  );
}

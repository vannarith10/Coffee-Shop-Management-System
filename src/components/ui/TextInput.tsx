//
//
//
import { useState } from "react";

interface Props {
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput = ({ onChange, value, placeholder }: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      className={`relative w-full flex ${isFocus ? "border-green-600" : "border-border"} border-2  rounded-md overflow-hidden`}
    >
      <input
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        type={"text"}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className=" placeholder:text-text-secondary px-4 py-2 bg-background-secondary/50 w-full focus:outline-none "
      />
    </div>
  );
};

export default TextInput;

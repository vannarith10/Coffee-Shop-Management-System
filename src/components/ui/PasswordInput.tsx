import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

interface Props {
  value: string | null;
  onChange: (value: string) => void;
}

const PasswordInput = ({ onChange, value }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      className={`relative w-full flex ${isFocus ? "border-green-600" : "border-border"} border-2  rounded-md overflow-hidden`}
    >
      <input
        autoComplete="new-password"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        type={showPassword ? "text" : "password"}
        minLength={8}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className="px-4 py-2 bg-transparent placeholder:text-sm placeholder:font-semibold w-full focus:outline-none "
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className=" absolute right-0 text-text-secondary top-0 bg-background-secondary px-4 py-2 cursor-pointer outline-none transition-all duration-500 ease-out"
      >
        {showPassword ? <Eye /> : <EyeClosed />}
      </button>
    </div>
  );
};

export default PasswordInput;

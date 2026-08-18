import { Delete, Search } from "lucide-react";
import React, { useState } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

const SearchBox = ({ value, onChange, onClear }: SearchInputProps) => {
  const [isFocusing, setIsFocusing] = useState(false);

  return (
    <div
      className={`${isFocusing ? "border-green-500" : "border-border-hover"} w-full flex items-center px-4 py-2 gap-4 border rounded-md`}
    >
      <Search />
      <input
        type="text"
        placeholder="Search product name"
        value={value}
        onFocus={() => setIsFocusing(true)}
        onBlur={() => setIsFocusing(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full font-semibold rounded-md outline-none placeholder:text-text-secondary`}
      />
      <button
        onClick={onClear}
        className={`${value !== "" ? "rotate-0 hover:text-text-error cursor-pointer active:scale-150" : "rotate-180"} outline-none transition-all duration-500 ease-out`}
      >
        <Delete />
      </button>
    </div>
  );
};

export default SearchBox;

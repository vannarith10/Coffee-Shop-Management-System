import { Image } from "lucide-react";
import React from "react";
import styled from "styled-components";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const Form = ({ onChange, onClear }: Props) => {
  return (
    <div className=" w-40 xl:w-60 aspect-square p-4 flex flex-col gap-4 items-center justify-between outline-2 outline-dashed outline-white rounded-xl">
      <label
        htmlFor="file"
        className="h-2/3 w-full bg-blue-400 hover:bg-blue-500 flex flex-col items-center justify-center p-2 gap-2 rounded-md cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none"
      >
        <Image size={48} />
        <span className="text-xs md:text-sm">Upload an image</span>
        <input
          id="file"
          type="file"
          accept="image/*"
          className=" hidden"
          onChange={onChange}
        />
      </label>
      <button
        type="button"
        onClick={onClear}
        className="w-full h1/3 text-xs py-2 text-text-error font-semibold hover:bg-red-600/30 border rounded-md cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none"
      >
        Clear
      </button>
    </div>
  );
};

export default Form;

import React from "react";
import TextLoader from "./TextLoader";


interface Props {
    isError: boolean;
    isPending: boolean;
}

const ButtonSubmit = ({ isError, isPending }:Props) => {
  return (
    <button
      type="submit"
      className={`w-full py-4 px-4 font-semibold text-xs sm:text-sm lg:text-lg col-span-2 ${isError ? "bg-amber-600" : "bg-sidebar/50 hover:bg-sidebar"}  rounded-lg cursor-pointer active:scale-80 outline-none transition-all duration-300 ease-out`}
    >
      {isError ? (
        "Try again"
      ) : isPending && !isError ? (
        <TextLoader text="Submitting..." />
      ) : (
        "Submit"
      )}
    </button>
  );
};

export default ButtonSubmit;

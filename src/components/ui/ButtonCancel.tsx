import React from "react";


interface Props {
    handelCancel: () => void;
}

const ButtonCancel = ({ handelCancel }:Props) => {
  return (
    <button
      type="button"
      onClick={handelCancel}
      className="py-4 px-4 font-semibold text-xs sm:text-sm lg:text-lg bg-text-error/50 hover:bg-text-error rounded-lg cursor-pointer active:scale-80 transition-all duration-200 ease-out"
    >
      Cancel
    </button>
  );
};

export default ButtonCancel;

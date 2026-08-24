//
// Displays Shop's name ans logo
//
import Loader from "./Loader";
import DefaultLogo from "../../assets/no-image.webp";
import ErrorImage from "../../assets/error-image.jpg";
import TextLoader from "../ui/TextLoader";
import type { ShopNameAndLogo } from "../../types/shop-setting";


interface Props {
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  data: ShopNameAndLogo | undefined;
  refetch: () => void;
}


const ShopProfile = ({
  isLoading,
  isRefetching,
  isError,
  data,
  refetch,
}: Props) => {
  return (
    <div className=" flex justify-between items-center">
      <div className="flex gap-2 items-center md:gap-4">
        <div
          className={` w-12 h-12 shrink-0 flex items-center justify-center rounded-lg overflow-hidden ${isLoading ? "p-2" : ""}`}
        >
          {/* Handle Loading */}
          {isLoading || isRefetching ? (
            <Loader />
          ) : (
            // Logo
            <img
              src={isError ? ErrorImage : data?.image_url || DefaultLogo}
              alt="Shop logo"
              className="w-full h-full object-cover bg-gray-400 border-2 border-white"
            />
          )}
        </div>

        {/* ======================== */}
        {/* Shop Name */}
        {/* ======================== */}
        <div className="flex items-center">
            <h1 className="font-bold text-sm md:text-lg shimmer shimmer-color-orange-500 text-text-primary uppercase transition-all duration-300">
              {(isLoading || isRefetching) && !isError ? (
                <TextLoader text="Loading" />
              ) : (
                data?.name
              )}
            </h1>
            {/* handle error */}
            {isError && (
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm uppercase shimmer shimmer-color-red-500">Error</p>
                <button
                  onClick={() => refetch()}
                  className=" font-semibold bg-background-secondary hover:bg-background-secondary-hover px-2 rounded-md cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
                >
                  Reload
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;

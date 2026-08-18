//
// components/cashier/Navbar.tsx
//
import DefaultLogo from "../../assets/no-image.webp";
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo";
import Loader from "../ui/Loader";
import ErrorImage from "../../assets/error-image.jpg";
import DefaultImage from "../../assets/image-default.jpg";
import TextLoader from "../ui/TextLoader";
import { useGetUserProfile } from "../../hooks/useGetUserProfile";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { LiquidGlass } from "../ui/LiguidGlass";
import ThemeSwitch from "../ui/ThemeSwitch";

const Navbar = () => {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useGetUserProfile();

  const { logout } = useAuth();

  return (
    <nav className=" z-90 fixed w-full bg-transparent shimmer shimmer-bg shimmer-color-pink-300 shimmer-duration-10000">
      <LiquidGlass
        className=" inset-0 w-full h-full "
        classChild="inset-0 flex gap-4 items-center justify-between p-4"
      >
        {/* =========================== */}
        {/* Logo & Name */}
        {/* =========================== */}
        <div className=" flex justify-between items-center">
          <div className="flex gap-2 items-center md:gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden ${isLoading ? "p-2" : ""}`}
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
            <h1 className="font-bold text-sm md:text-lg shimmer shimmer-color-orange-500 text-text-primary uppercase transition-all duration-300">
              {(isLoading || isRefetching) && !isError ? (
                <TextLoader text="Loading" />
              ) : (
                data?.name
              )}

              {/* handle error */}
              {isError && (
                <div className="flex gap-2">
                  <p className="text-text-error">Error</p>
                  <button
                    onClick={() => refetch()}
                    className="font-light bg-background-secondary hover:bg-background-secondary-hover px-2 rounded-md cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
                  >
                    Reload
                  </button>
                </div>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* ============================== */}
          {/* Cashier profile */}
          {/* ============================== */}
          <div className="flex items-center gap-2">
            <div>
              <h4 className="text-xs text-end">{profile?.role || "Role"}</h4>
              <h3 className="text-sm font-bold whitespace-nowrap">
                {profile?.name || "Username"}
              </h3>
            </div>

            {/* Handle profile loading */}
            {isProfileLoading ? (
              <Loader />
            ) : (
              <img
                src={profile?.image_url || DefaultImage}
                alt="profile"
                className="w-12 h-12 object-cover rounded-full border-2 border-white"
              />
            )}

            {/* Handle error profile */}
            {isProfileError && (
              <button
                onClick={() => refetchProfile()}
                className="font-light bg-background-secondary hover:bg-background-secondary-hover px-2 rounded-md cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
              >
                Reload
              </button>
            )}
          </div>

          {/* ======================= */}
          {/* Switch & Logout */}
          {/* ======================= */}
          <div className="flex items-center gap-4">
            {/* Theme switch */}
            <ThemeSwitch/>
            {/* Logout button */}
            <button
              onClick={() => logout()}
              className="bg-red-700 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 ease-out active:scale-80 outline-none cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </LiquidGlass>
    </nav>
  );
};

export default Navbar;

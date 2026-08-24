//
// components/cashier/Navbar.tsx
//
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo";
import { useGetUserProfile } from "../../hooks/useGetUserProfile";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { LiquidGlass } from "../ui/LiguidGlass";
import ThemeSwitch from "../ui/ThemeSwitch";
import ShopProfile from "../ui/ShopProfile";
import UserProfile from "../ui/UserProfile";

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

  //   click once, refetch all
  function handleRefetch() {
    refetch();
    refetchProfile();
  }

  return (
    <nav className=" z-90 fixed w-full bg-transparent shimmer shimmer-bg shimmer-color-pink-300 shimmer-duration-10000">
      <LiquidGlass
        className=" inset-0 w-full h-full "
        classChild="inset-0 flex gap-4 items-center justify-between p-4"
      >
        {/* =========================== */}
        {/* Logo & Name */}
        {/* =========================== */}
        <ShopProfile
          data={data}
          isError={isError}
          isLoading={isLoading}
          isRefetching={isRefetching}
          refetch={handleRefetch}
        />

        <div className="flex items-center gap-4 shrink-0">
          {/* ============================== */}
          {/* Cashier profile */}
          {/* ============================== */}
          <UserProfile
            data={profile}
            isLoading={isProfileLoading}
            isError={isProfileError}
            refetch={handleRefetch}
          />

          {/* ======================= */}
          {/* Switch & Logout */}
          {/* ======================= */}
          <div className="flex items-center gap-4">
            {/* Theme switch */}
            <ThemeSwitch />
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

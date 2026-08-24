//
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/useAuth";
import { useGetShopNameAndLogo } from "../../hooks/barista/useGetShopNameAndLogo";
import { useGetUserProfile } from "../../hooks/useGetUserProfile";
import ShopProfile from "../ui/ShopProfile";
import ThemeSwitch from "../ui/ThemeSwitch";
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
    <nav className="z-90 w-full bg-sidebar p-4 flex items-center justify-between sticky top-0 shadow-[0_20px_50px_rgba(8,112,184,0.7)] shimmer shimmer-bg shimmer-color-blue-500 shimmer-duration-10000">
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
    </nav>
  );
};

export default Navbar;

//
// components/cashier/Navbar.tsx
//
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo";
import { useGetUserProfile } from "../../hooks/useGetUserProfile";
import { LogOut } from "lucide-react";
// import { useAuth } from "../../contexts/useAuth";
import ThemeSwitch from "../ui/ThemeSwitch";
import ShopProfile from "../ui/ShopProfile";
import UserProfile from "../ui/UserProfile";
import { useEffect, useState } from "react";
import MenuSwitch from "../ui/MenuSwitch";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuthStore } from "../../stores/useAuthStore";

const Navbar = () => {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useGetUserProfile();

  // const { logout } = useAuth();
  const logout = useAuthStore().logout;
  const [isOpen, setIsOpen] = useState(false);


  //   click once, refetch all
  function handleRefetch() {
    refetch();
    refetchProfile();
  }


  // Handle "setIsOpen -> false" when screen >= 768px
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsOpen(false);
      }
    };

    handleResize(mediaQuery);

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <nav
      className={` ${isOpen ? "inset-0 pt-10" : ""} flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-4 p-4 z-90 fixed w-full bg-sidebar transition-all duration-300 ease-out shimmer shimmer-bg shimmer-color-background-primary shimmer-duration-10000`}
    >
      {/* =========================== */}
      {/* Logo & Name */}
      {/* =========================== */}
      <div className="w-full flex justify-between items-center ">
        <ShopProfile
          data={data}
          isError={isError}
          isLoading={isLoading}
          isRefetching={isRefetching}
          refetch={handleRefetch}
        />
        <MenuSwitch handleOpen={() => setIsOpen(!isOpen)} open={isOpen} />
      </div>

      {/* -----------------------
      
        Navbar for Mobile mode
      
      -------------------------*/}
      <div
        hidden={!isOpen}
        className="md:hidden h-full flex flex-col items-center gap-10 w-full pt-10 border-t border-gray-400"
      >
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
        <div className=" flex flex-col h-full justify-between items-center pb-10 gap-4 ">
          {/* Theme switch */}
          <ThemeSwitch />
          {/* Logout button */}
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-sm font-semibold bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all duration-200 ease-out active:scale-80 outline-none cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* -----------------------
      
        Navbar for Desktop mode
      
      -------------------------*/}
      <div className="h-full md:h-fit hidden md:flex shrink-0 items-center gap-4 ">
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
        <div className=" flex justify-between items-center gap-4 ">
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

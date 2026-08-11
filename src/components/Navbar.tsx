// components/Navbar.tsx
//
import NoImage from "../assets/no-image.webp"
import ErrorImage from "../assets/error-image.jpg";
import { useState } from "react";
import Loader from "./ui/Loader";
import MenuSwitch from "./ui/MenuSwitch";
import { links } from "../constants/navLinks";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "./ui/ThemeSwitch";
import LogoutButton from "./ui/LogoutButton";
import { useGetShopNameAndLogo } from "../hooks/useGetShopNameAndLogo";
import TextLoader from "./ui/TextLoader";

export default function Navbar() {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();
  const [open, setOpen] = useState(false);

  // Disable scrolling screen
  if (open) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  return (
    <nav
      className={`z-90 fixed md:hidden w-screen top-0 ${open ? "h-screen flex flex-col justify-between" : "h-20 ease-in"} px-4 py-4 bg-sidebar transition-all duration-500 ease-out`}
    >
      {/*  */}
      {/*  */}
      <section
        className={`w-full ${open ? "mt-10 gap-10" : ""} flex flex-col items-center justify-between transition-all duration-300 ease-out`}
      >
        {/* Logo and Name */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full overflow-hidden ${isLoading ? "p-2" : ""}`}
            >
              {(isLoading || isRefetching) ? (
                <Loader />
              ) : (
                <img
                  src={isError ? ErrorImage : data?.image_url || NoImage}
                  alt="Shop logo"
                  className="w-full h-full rounded-full object-cover border-2 border-white bg-gray-400"
                />
              )}
            </div>

            {/* ======================== */}
            {/* Shop Name */}
            {/* ======================== */}
            <h1 className="font-bold text-text-primary uppercase transition-all duration-300">
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
          <MenuSwitch handleOpen={() => setOpen(!open)} open={open} />
        </div>
        {/* ================================== */}
        {/* List of menu */}
        {/* ================================== */}
        <div className={`${open ? "w-full flex flex-col gap-4" : "hidden"}`}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.end}
                onClick={() => setOpen(false)}
                className={(props) =>
                  `${navlink(props)} font-semibold flex items-center gap-4 text-text-primary py-2 rounded-md outline-none transition-all duration-300 ease-out`
                }
              >
                {Icon && <Icon />}
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </section>

      {/* Bottom buttons */}
      <section className={`${open ? "" : "hidden"}`}>
        <div className="w-full flex flex-col gap-4">
          <ThemeSwitch />
          <LogoutButton />
        </div>
      </section>
      {/*  */}
      {/*  */}
    </nav>
  );
}

const navlink = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-background-secondary hover:bg-background-secondary border-l-4 pl-2"
    : "hover:bg-background-secondary-hover pl-6";

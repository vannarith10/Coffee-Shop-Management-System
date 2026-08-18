//
// components/Navbar.tsx
//
import NoImage from "../assets/no-image.webp";
import ErrorImage from "../assets/error-image.jpg";
import { useEffect, useState } from "react";
import Loader from "./ui/Loader";
import MenuSwitch from "./ui/MenuSwitch";
import { links } from "../constants/navLinks";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "./ui/ThemeSwitch";
import LogoutButton from "./ui/LogoutButton";
import { useGetShopNameAndLogo } from "../hooks/useGetShopNameAndLogo";
import TextLoader from "./ui/TextLoader";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // open === true => add "overflow-hidden"
    // open === false => remove "overflow-hidden"
    // toggle now can add and remove
    document.body.classList.toggle("overflow-hidden", open);

    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <nav
      className={`z-90 fixed md:hidden w-screen top-0 ${open ? "h-screen overflow-y-scroll scrollbar-hide flex flex-col gap-y-4 justify-between" : "h-20 ease-in"} px-4 py-4 bg-sidebar transition-all duration-500 ease-out shimmer shimmer-bg shimmer-color-blue-300 shimmer-duration-9000`}
    >
      {/*  */}
      {/*  */}
      <section
        className={` w-full ${open ? "mt-10 gap-10" : ""} flex flex-col items-center justify-between transition-all duration-300 ease-out`}
      >
        {/* Logo and Name */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full overflow-hidden ${isLoading ? "p-2" : ""}`}
            >
              {isLoading || isRefetching ? (
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
            <h1 className="font-bold shimmer shimmer-color-orange-500 text-foreground/40 uppercase transition-all duration-300">
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
        {open && (
          <div className={"w-full flex flex-col gap-4"}>
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.label}
                  initial={{ scale: 0.8, opacity: 0, x: 50 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 8,
                    delay: idx * 0.1,
                  }}
                  className="w-full"
                >
                  <NavLink
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
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom buttons */}
      {open && (
        <motion.div
          initial={{ scale: 0.2, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 4,
          }}
          className="w-full flex flex-col items-center gap-4"
        >
          <ThemeSwitch />
          <LogoutButton />
        </motion.div>
      )}
      {/*  */}
      {/*  */}
    </nav>
  );
}

const navlink = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-background-secondary hover:bg-background-secondary border-l-4 pl-2 shimmer shimmer-bg shimmer-color-pink-300 shimmer-duration-3000"
    : "hover:bg-background-secondary-hover pl-6";

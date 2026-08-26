//
// components/Navbar.tsx
//
import { useEffect, useState } from "react";
import MenuSwitch from "./ui/MenuSwitch";
import { links } from "../constants/navLinks";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "./ui/ThemeSwitch";
import LogoutButton from "./ui/LogoutButton";
import { useGetShopNameAndLogo } from "../hooks/useGetShopNameAndLogo";
import { motion } from "framer-motion";
import ShopProfile from "./ui/ShopProfile";

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
      className={` z-90 w-full md:hidden ${open ? " fixed inset-0 overflow-y-scroll scrollbar-hide flex flex-col justify-start gap-10 pt-10 " : "sticky top-0 "} px-4 py-4 bg-sidebar transition-all duration-500 ease-out shimmer shimmer-bg shimmer-color-blue-300 shimmer-duration-9000`}
    >

        {/* -----------------------------
                 Logo and Name
        ------------------------------ */}
        <div className="w-full flex justify-between items-center ">
          <ShopProfile
            isLoading={isLoading}
            isError={isError}
            isRefetching={isRefetching}
            data={data}
            refetch={refetch}
          />
          <MenuSwitch handleOpen={() => setOpen(!open)} open={open} />
        </div>



        {/* --------------------------------------
                    Nav menu items
        --------------------------------------- */}
        {open && (
          <div className={"w-full flex flex-col gap-4 "}>
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
                    damping: 10,
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


      {/* ------------------------------------
                Theme & Logout
      ------------------------------------- */}
      {open && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 10,
          }}
          className="w-full h-full flex flex-col justify-between items-center "
        >
          <ThemeSwitch />
          <LogoutButton />
        </motion.div>
      )}
    </nav>
  );
}

const navlink = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-background-secondary hover:bg-background-secondary border-l-4 pl-2 shimmer shimmer-bg shimmer-color-pink-300 shimmer-duration-3000"
    : "hover:bg-background-secondary-hover pl-6";

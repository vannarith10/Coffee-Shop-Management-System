// components/Navbar.tsx
//
import LOGO from "../assets/vr-nobackground.png";
import ErrorImage from "../assets/error-image.jpg";
import { useState, useEffect } from "react";
import Loader from "./ui/Loader";
import { getShopImageAndName } from "../services/admin.service";
import MenuSwitch from "./ui/MenuSwitch";
import { links } from "../constants/navLinks";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "./ui/ThemeSwitch";
import LogoutButton from "./ui/LogoutButton";

export default function Navbar() {
  const [shopName, setShopName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState(false);

  // Disable scrolling screen
  if (open) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getShopImageAndName();
        setShopName(data.name);
        setImage(data.image_url);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <nav
      className={`fixed md:hidden w-screen top-0 z-10 ${open ? "h-screen flex flex-col justify-between" : "h-20 ease-in"} px-4 py-4 bg-sidebar transition-all duration-500 ease-out`}
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
              {isLoading ? (
                <Loader />
              ) : (
                <img
                  src={isError ? ErrorImage : image || LOGO}
                  alt="Shop logo"
                  className="w-full h-full rounded-full object-cover border border-border bg-gray-400"
                />
              )}
            </div>
            <h1 className="font-bold text-text-primary uppercase transition-all duration-300">
              {shopName || "SHOP NAME"}
            </h1>
          </div>
          <MenuSwitch handleOpen={() => setOpen(!open)} open={open} />
        </div>
        {/* List of menu */}
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
                  `${navlink(props)} font-semibold flex items-center gap-4 text-text-primary py-2 rounded-md transition-all duration-300 ease-out`
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

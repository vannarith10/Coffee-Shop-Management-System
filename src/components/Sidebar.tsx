// components/Sidebar.tsx
//
import { useEffect, useState } from "react";
import { getShopImageAndName } from "../services/admin.service";
import LOGO from "../assets/vr-nobackground.png";
import ErrorImage from "../assets/error-image.jpg";
import Loader from "./ui/Loader";
import LogoutButton from "./ui/LogoutButton.tsx";
import ThemeSwitch from "./ui/ThemeSwitch.tsx";
import { NavLink } from "react-router-dom";
import {links} from "../constants/navLinks.ts";


export default function Sidebar() {
  const [shopName, setShopName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);


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
    <aside className="sticky top-0 h-screen w-60 lg:w-80 bg-sidebar p-4 hidden md:flex flex-col justify-between transition-all duration-500 ease-out shrink-0">
      {/*  */}
      {/*  */}
      <section className="flex flex-col gap-10">
        {/* Image & Shop name */}
        <div className="w-full flex items-center gap-4">
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
          <h1 className="font-bold text-text-primary uppercase  transition-all duration-300">
            {shopName || "SHOP NAME"}
          </h1>
        </div>
        {/* List of menu */}
        {/* Showing on when md: */}
        <div className="flex flex-col gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.end}
                className={(props) =>`${navlink(props)} font-semibold flex items-center gap-4 text-text-primary py-2 rounded-md transition-all duration-300 ease-out`}
              >
                {Icon && <Icon />}
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </section>

      {/*  */}
      {/*  */}
      <section>
        <div className="w-full flex flex-col gap-4">
          <ThemeSwitch />
          <LogoutButton />
        </div>
      </section>
      {/*  */}
      {/*  */}
    </aside>
  );
}

const navlink = ({isActive}:{isActive:boolean}) => isActive ? "bg-background-secondary hover:bg-background-secondary border-l-4 pl-2" : "hover:bg-background-secondary-hover pl-6";

//
// components/Sidebar.tsx
//
import NoImage from "../../assets/no-image.webp";
import ErrorImage from "../../assets/error-image.jpg";
import Loader from "../ui/Loader.tsx";
import LogoutButton from "../ui/LogoutButton.tsx";
import ThemeSwitch from "../ui/ThemeSwitch.tsx";
import { NavLink } from "react-router-dom";
import { links } from "../../constants/navLinks.ts";
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo.ts";
import TextLoader from "../ui/TextLoader.tsx";

export default function Sidebar() {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();

  return (
    <aside className="sticky top-0 h-screen w-60 lg:w-80 bg-sidebar p-4 hidden md:flex flex-col justify-between transition-all duration-500 ease-out shrink-0">
      {/*  */}
      {/*  */}
      <section className="flex flex-col gap-10">
        {/* ==================================== */}
        {/* Image & Shop name */}
        {/* ==================================== */}
        <div className="w-full flex items-center gap-4">
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
          <h1 className="font-bold shimmer shimmer-color-orange-500 text-foreground/40 uppercase  transition-all duration-300">
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
        {/* ======================================== */}
        {/* List of menu */}
        {/* Showing on when md: */}
        {/* ======================================== */}
        <div className="flex flex-col gap-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.end}
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

      {/*  */}
      {/*  */}
      <section>
        <div className="w-full flex flex-col gap-4 items-center">
          <ThemeSwitch />
          <LogoutButton />
        </div>
      </section>
      {/*  */}
      {/*  */}
    </aside>
  );
}

const navlink = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-background-secondary hover:bg-background-secondary border-l-4 pl-2 shimmer shimmer-bg shimmer-color-pink-300 shimmer-duration-3000"
    : "hover:bg-background-secondary-hover pl-6";

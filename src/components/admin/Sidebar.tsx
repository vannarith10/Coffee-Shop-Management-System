//
// components/Sidebar.tsx
//
import LogoutButton from "../ui/LogoutButton.tsx";
import ThemeSwitch from "../ui/ThemeSwitch.tsx";
import { NavLink } from "react-router-dom";
import { links } from "../../constants/navLinks.ts";
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo.ts";
import ShopProfile from "../ui/ShopProfile.tsx";

export default function Sidebar() {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();

  return (
    <aside className="sticky top-0 h-screen w-60 lg:w-80 bg-sidebar p-4 hidden md:flex flex-col justify-between transition-all duration-500 ease-out shrink-0">
      <section className="flex flex-col gap-10">
        {/* -----------------------------------------
                      *
                      Shop Profile
                      *
        ------------------------------------------ */}
        <div className="w-full flex items-center gap-4">
          <ShopProfile
            data={data}
            isLoading={isLoading}
            isError={isError}
            isRefetching={isRefetching}
            refetch={refetch}
          />
        </div>

        {/* -----------------------------------------
                      *
                      Display Menus
                      *
        ------------------------------------------ */}
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

      {/* -----------------------------------------
                    *
                    Theme & Logout
                    *
        ------------------------------------------ */}
      <div>
        <div className="w-full flex flex-col gap-4 items-center">
          <ThemeSwitch />
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

const navlink = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "bg-background-secondary hover:bg-background-secondary border-l-4 pl-2 shimmer shimmer-bg shimmer-color-pink-300 shimmer-duration-3000"
    : "hover:bg-background-secondary-hover pl-6";

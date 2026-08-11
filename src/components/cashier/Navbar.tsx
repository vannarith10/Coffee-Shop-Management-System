import { useEffect, useState } from "react";
import DefaultLogo from "../../assets/no-image.webp";
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo";
import Loader from "../ui/Loader";
import ErrorImage from "../../assets/error-image.jpg";
import DefaultImage from "../../assets/image-default.jpg";
import TextLoader from "../ui/TextLoader";
import LogoutButton from "../ui/LogoutButton";
import SearchBox from "../ui/SearchBox";
import Switch from "../ui/Switch";
import { useDebounce } from "../../hooks/useDebounce";
import { useProductFilter } from "../../hooks/useProductFilter";
import { useGetUserProfile } from "../../hooks/useGetUserProfile";

const Navbar = () => {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useGetUserProfile();

  const { keyword, setKeyword } = useProductFilter();
  const [inputValue, setInputValue] = useState(keyword ?? "");
  const debouncedKeyword = useDebounce(inputValue, 500);

  // =====================================
  // Debounce handles setKeyword
  // handle send request when user stops typing
  // =====================================
  useEffect(() => {
    // setKeyword gets value from debouncedKeyword, and debouncedKeyword gets from inputValue
    setKeyword(debouncedKeyword);
  }, [debouncedKeyword, setKeyword]);


  // When filtering, we set keyword to "" empty string
  // but the input box still showing the text
  // so this block will clear that text
  // Finally, if "keywork" = empty then text box will be empty too
  useEffect(() => {
    (() => {
      if (keyword == "" || keyword == null) {
        setInputValue("");
      }
    })();
  }, [keyword]);

  // Handle set input value
  function handleInputOnChange(value: string) {
    setInputValue(value);
  }

  // Handle clear input
  function handleClearInput() {
    setKeyword(null);
    setInputValue("");
  }

  return (
    <nav className="flex items-center justify-between gap-4 bg-sidebar backdrop-blur-md z-90 fixed w-full p-4 ">
      {/* =========================== */}
      {/* Logo & Name */}
      {/* =========================== */}
      <div className=" flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden ${isLoading ? "p-2" : ""}`}
          >
            {/* Handle Loading */}
            {isLoading || isRefetching ? (
              <Loader />
            ) : (
              // Logo
              <img
                src={isError ? ErrorImage : data?.image_url || DefaultLogo}
                alt="Shop logo"
                className="w-full h-full object-cover bg-gray-400 border-2 border-white"
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
      </div>

      {/* ===================== */}
      {/* Search box */}
      {/* ===================== */}
      <div>
        <SearchBox
          value={inputValue}
          onChange={handleInputOnChange}
          onClear={handleClearInput}
        />
      </div>

      {/* ============================== */}
      {/* Cashier profile */}
      {/* ============================== */}
      <div className="flex items-center gap-2">
        <div>
          <h4 className="text-xs text-end">{profile?.role || "Role"}</h4>
          <h3 className="text-sm font-bold">{profile?.name || "Username"}</h3>
        </div>

        {/* Handle profile loading */}
        {isProfileLoading ? (
          <Loader />
        ) : (
          <img
            src={profile?.image_url || DefaultImage}
            alt="profile"
            className="w-12 h-12 object-cover rounded-full border-2 border-white"
          />
        )}

        {/* Handle error profile */}
        {isProfileError && (
          <button
            onClick={() => refetchProfile()}
            className="font-light bg-background-secondary hover:bg-background-secondary-hover px-2 rounded-md cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
          >
            Reload
          </button>
        )}
      </div>

      {/* ======================= */}
      {/* Switch & Logout */}
      {/* ======================= */}
      <div className="flex items-center gap-2">
        {/* Theme switch */}
        <Switch />
        {/* Logout button */}
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;

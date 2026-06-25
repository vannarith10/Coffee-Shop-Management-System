// components/ui/ThemeSwitch.tsx
//
import { useTheme } from "../../contexts/useTheme";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => toggleTheme()}
      className="w-full py-4 bg-background-secondary rounded-md relative overflow-hidden cursor-pointer focus:outline-none transition-all duration-500 ease-out"
    >
      <div
        className={`bg-background-primary h-full w-[50%] flex justify-center font-semibold text-text-primary items-center absolute top-1/2 -translate-y-1/2 ${theme === "light" ? "translate-x-full" : ""} rounded-md transition-all duration-500 ease-out`}
      >
        {theme === "light" ? <h4>Light</h4> : <h4>Dark</h4>}
      </div>
    </button>
  );
}


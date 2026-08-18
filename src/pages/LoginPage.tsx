import { useRef, useState, useEffect } from "react";
import { login as loginApi } from "../services/auth.service";
import { useAuth } from "../contexts/useAuth";
import { Role } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { LiquidGlass } from "../components/ui/LiguidGlass";
import ThemeSwitch from "../components/ui/ThemeSwitch";
import { gsap } from "gsap";
import { useTheme } from "../contexts/useTheme";
import DarkTemple from "../assets/dark-temple.png";
import LightTemple from "../assets/light-temple.jpg";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const targetRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!targetRef.current) return;

      const { innerWidth, innerHeight } = window;

      const x = (e.clientX / innerWidth - 0.5) * 40;
      const y = (e.clientY / innerHeight - 0.5) * 40;

      gsap.to(targetRef.current, {
        x,
        y,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await loginApi({ username, password });

      // Save user data
      login(response.user_info, response.access_token, response.refresh.token);

      switch (response.user_info.role) {
        case Role.ADMIN:
          navigate("/admin", { replace: true });
          break;
        case Role.CASHIER:
          navigate("/cashier", { replace: true });
          break;
        case Role.BARISTA:
          navigate("/barista", { replace: true });
          break;
        default:
          navigate("/unauthorized", { replace: true });
          break;
      }
    } catch (error) {
      console.error(error);
      console.log(error);
      setIsError(true);
    }
  }

  return (
    <div
      className={` relative w-screen h-screen overflow-hidden flex flex-col gap-4 justify-center items-center transition-colors duration-300 ease-out`}
    >
      {/* Dark background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${DarkTemple})` }}
      />

      {/* Light background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${LightTemple})` }}
      />

      {/* Foreground */}
      <div ref={targetRef}>
        <LiquidGlass className="rounded-2xl">
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center gap-6 w-80 p-10 rounded-4xl border-0 border-border overflow-hidden"
          >
            <h2 className="font-bold text-2xl text-white text-center">
              Login to System
            </h2>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-2 border-2 border-border outline-none bg-background-secondary"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border-2 border-border outline-none bg-background-secondary"
            />
            {isError && (
              <h3 className="text-sm text-red-500">
                Invalid username or password
              </h3>
            )}
            <button
              type="submit"
              className="shimmer shimmer-bg shimmer-color-blue-300/50 shimmer-duration-3000 py-4 w-full px-8 font-bold text-text-primary bg-background-secondary rounded-md cursor-pointer hover:bg-background-secondary-hover active:scale-90 transition-all duration-200 ease-out outline-none"
            >
              Login
            </button>
            <ThemeSwitch />
          </form>
        </LiquidGlass>
      </div>
    </div>
  );
}

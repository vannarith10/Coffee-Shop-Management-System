import { useState } from "react";
import { login as loginApi } from "../services/auth.service";
import { useAuth } from "../contexts/useAuth";
import { Role } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";
import SpotlightCard from "../components/animation/SpotlightCard";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

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
      className={`w-screen h-screen flex justify-center items-center ${theme == "light" ? "bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#6366f1_100%)]" : "bg-[radial-gradient(125%_125%_at_50%_10%,#0F1D29_40%,#5B8DA3_100%)]"} transition-colors duration-300 ease-out`}
    >
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 w-80 backdrop-blur-xs p-10 rounded-4xl border-4 border-border"
      >
        <h2 className="font-bold text-2xl text-text-secondary text-center">
          Login to System
        </h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-2 border-2 border-border"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border-2 border-border"
        />
        {isError && (
          <h3 className="text-sm text-red-500">Invalid username or password</h3>
        )}
        <SpotlightCard>
          <button
            type="submit"
            className="py-4 w-full px-8 font-bold text-text-primary bg-background-secondary hover:bg-background-primary-hover cursor-pointer "
          >
            Login
          </button>
        </SpotlightCard>
      </form>
    </div>
  );
}

// contexts/AuthProvider.tsx
//
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authStorage } from "../utils/auth-storage";
import { refreshAccessToken } from "../services/auth.service";
import type { RefreshResponse } from "../types/auth";
import type { UserInfo } from "../types/auth";
import useCartStore from "../hooks/cashier/useCartStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  //
  // Load user info
  //
  const [user, setUser] = useState<UserInfo | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authStorage.getUser();
        const accessToken = authStorage.getAccessToken();
        const refreshToken = authStorage.getRefreshToken();

        // If no Refresh Token, go to Login
        if (!refreshToken) {
          authStorage.remove();
          setUser(null);
          return;
        }

        if (storedUser && accessToken) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            return;
          } catch {
            authStorage.remove();
            setUser(null);
            return;
          }
        }

        //
        // If storedUser & accessToken = false | Do this task
        //
        const refreshResponse: RefreshResponse =
          await refreshAccessToken(refreshToken);

        authStorage.setAccessToken(refreshResponse.access_token);
        authStorage.setRefreshToken(refreshResponse.refresh.token);
        authStorage.setUser(refreshResponse.user_info);
        setUser(refreshResponse.user_info);
        //
      } catch {
        authStorage.remove();
        setUser(null);
        //
      } finally {
        setCheckingUser(false);
      }
    };

    loadUser();
  }, []);

  //
  // Save data after login
  //
  function login(
    userData: UserInfo,
    accessToken: string,
    refreshToken: string,
  ) {
    authStorage.setAccessToken(accessToken);
    authStorage.setRefreshToken(refreshToken);
    authStorage.setUser(userData);
    setUser(userData);
  }

  //
  // Remove data after logout
  //
  function logout() {
    authStorage.remove();
    setUser(null);
    clearCart();
  }

  //
  // Clear data just like Logout | used for other purposes beside logout
  //
  function clearUserData() {
    authStorage.remove();
    setUser(null);
  }

  //
  //
  return (
    <AuthContext.Provider
      value={{ user, login, logout, clearUserData, checkingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//
//  stores/useAuthStore.ts
//
import { create } from "zustand";
import type { RefreshResponse, UserInfo } from "../types/auth";
import { persist } from "zustand/middleware";
import { refreshAccessToken } from "../services/auth.service";
import { websocketManager } from "../websocket/websocket-manager";


interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialized: boolean;

  initialize: () => Promise<void>;

  login: (
    user: UserInfo,
    accessToken: string,
    refreshToken: string,
  ) => void;

  logout: () => Promise<void>;

  refresh: () => Promise<string>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      initialized: false,




      initialize: async () => {
        try {
          const refreshToken = get().refreshToken;

          if (!refreshToken) {
            set({
              initialized: true,
              user: null,
            });
            return;
          }

          const response: RefreshResponse =
            await refreshAccessToken(refreshToken);

          set({
            user: response.user_info,
            accessToken: response.access_token,
            refreshToken: response.refresh.token,
            initialized: true,
          });

          websocketManager.connect();
        } catch (error) {
          console.error(error);

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            initialized: true,
          });
        }
      },




      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
        });

        websocketManager.connect();
      },




      logout: async () => {
        await websocketManager.disconnect();

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },




      refresh: async () => {
        const refreshToken = get().refreshToken;

        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }

        const response: RefreshResponse =
          await refreshAccessToken(refreshToken);

        set({
          accessToken: response.access_token,
          refreshToken: response.refresh.token,
          user: response.user_info,
        });

        await websocketManager.disconnect();
        websocketManager.connect();

        console.info("Refreshing token...");
        return response.access_token;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

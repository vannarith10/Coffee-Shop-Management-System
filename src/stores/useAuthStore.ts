//
//  stores/useAuthStore.ts
//
import { create } from "zustand";
import type { UserInfo } from "../types/user";
import { persist } from "zustand/middleware";
import { websocketManager } from "../websocket/websocket-manager";
import { refreshWithLock } from "../lib/auth-refresh";


// Define shape of store
interface AuthState {
  // Data state
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Process state
  initialized: boolean; // True: Authentication check completed, False: Still checking
  isInitializing: boolean;

  // Actions
  initialize: () => Promise<void>;
  login: (user: UserInfo, accessToken: string, refreshToken: string) => void;
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
      isInitializing: false,

      initialize: async () => {
        if (get().isInitializing || get().initialized) return;

        set({ isInitializing: true });

        try {
          const refreshToken = get().refreshToken;

          if (!refreshToken) {
            console.log("NO REFRESH TOKEN");
            set({
              initialized: true,
              isInitializing: false,
              user: null,
            });
            return;
          }

          await refreshWithLock();

          set({
            initialized: true,
            isInitializing: false,
          });
        } catch (error) {
          console.error("REFRESH FAILED", error);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            initialized: true,
            isInitializing: false,
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
        return refreshWithLock();
      },
      

    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    },
  ),
);

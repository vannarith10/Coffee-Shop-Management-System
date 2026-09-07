import { useAuthStore } from "../stores/useAuthStore";

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function parseJwt(token: string) {
  return JSON.parse(atob(token.split(".")[1]));
}

export function scheduleTokenRefresh(token: string) {
  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
  }

  const payload = parseJwt(token);
  const expiresAt = payload.exp * 1000;
  const refreshAt = expiresAt - 60_000;
  const delay = Math.max(refreshAt - Date.now(), 0);

  console.log(
    "Token refresh scheduled in",
    Math.round(delay / 1000),
    "seconds",
  );

  refreshTimer = window.setTimeout(async () => {
    try {
      await useAuthStore.getState().refresh();
    } catch (e) {
      console.error("Auto refresh failed", e);
    }
  }, delay);
}

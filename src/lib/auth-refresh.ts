import { refreshAccessToken } from "../services/auth.service";
import { useAuthStore } from "../stores/useAuthStore";
import { scheduleTokenRefresh } from "./auth-token-scheduler";

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await refreshAccessToken(refreshToken);

  useAuthStore.setState({
    accessToken: response.access_token,
    refreshToken: response.refresh.token,
    user: response.user_info,
  });

  const accessToken = response.access_token;

  scheduleTokenRefresh(accessToken);

  return accessToken;
}

// បើមាន API Request ច្រើនពេលតែមួយ ហើយ Access Token Expired កុំឱ្យពួកវាទាំងអស់ Refresh Token ក្នុងពេលតែមួយ។
export async function refreshWithLock() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performRefresh();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

import { refreshAccessToken } from "../services/auth.service"; 
import { useAuthStore } from "../stores/useAuthStore"; 

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken =
    useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response =
    await refreshAccessToken(refreshToken);

  useAuthStore.setState({
    accessToken: response.access_token,
    refreshToken: response.refresh.token,
    user: response.user_info,
  });

  return response.access_token;
}

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
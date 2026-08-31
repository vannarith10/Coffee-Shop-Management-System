//
//
//

export function isTokenExpired(token: string, thresholdSeconds = 60): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp * 1000 < Date.now() + thresholdSeconds * 1000;
  } catch {
    return true;
  }
}

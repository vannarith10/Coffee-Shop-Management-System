// util/auth-storage
//
import type { UserInfo } from "../types/auth";

export const authStorage = {
    setAccessToken: (token: string) => localStorage.setItem("access_token", token),
    setRefreshToken: (token: string) => localStorage.setItem("refresh_token", token),
    setUser: (user: UserInfo) => localStorage.setItem("user", JSON.stringify(user)),
    

    getAccessToken: () => localStorage.getItem("access_token"),
    getRefreshToken: () => localStorage.getItem("refresh_token"),
    getUser: () => localStorage.getItem("user"),

    remove: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    }
}
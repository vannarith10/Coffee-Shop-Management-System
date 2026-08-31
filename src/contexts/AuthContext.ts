//
// contexts/AuthContext.ts
//
import type { UserInfo } from "../types/auth";
import { createContext } from "react";


export interface AuthContextType {
    user: UserInfo | null;
    login: (user:UserInfo, accessToken:string, refreshToken:string) => void;
    logout: () => void;
    clearUserData: () => void;
    checkingUser: boolean;
}


export const AuthContext = createContext<AuthContextType | null>(null);
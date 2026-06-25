
import { AuthProvider } from "./contexts/AuthProvider";
import type { ReactNode } from "react";
import { ThemeProvider } from "./contexts/ThemeProvider";

export default function AppProvider ({children}: {children: ReactNode;}) {

    return(
        <ThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}
import { AuthProvider } from "./contexts/AuthProvider";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";

export default function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MantineProvider>{children}</MantineProvider>
        </AuthProvider>
    </QueryClientProvider>
  );
}

//
// secutiry/PublicRoute.tsx
//

import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { useAuthStore } from "../stores/useAuthStore";
import { type RoleType } from "../features/staff/types/enums";

function getRoute(role: RoleType) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "CASHIER":
      return "/cashier";
    case "BARISTA":
      return "/barista";
    default:
      return "/unauthorized";
  }
}

export default function PublicRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return (
      <div className="relative">
        {children}

        <div className="absolute h-screen w-screen inset-0 bg-gray-500/50 backdrop-blur-xs flex flex-col items-center justify-center gap-4">
          <Loader size={100} />
          <h3 className="text-2xl font-bold text-text-primary">
            Checking session...
          </h3>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={getRoute(user.role)} replace />;
  }

  return children;
}

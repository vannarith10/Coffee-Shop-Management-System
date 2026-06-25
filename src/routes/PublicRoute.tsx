// secutiry/PublicRoute.tsx
//

import { useAuth } from "../contexts/useAuth";
import { Role } from "../types/auth";
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

function getRoute(role: Role) {
  switch (role) {
    case Role.ADMIN:
      return "/admin";
    case Role.CASHIER:
      return "/cashier";
    case Role.BARISTA:
      return "/barista";
    default:
      return "/unauthorized";
  }
}

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { user, checkingUser } = useAuth();

  if (checkingUser) {
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

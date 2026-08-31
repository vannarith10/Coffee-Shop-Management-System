//
// routes/RoleRoute.tsx
//

import { useAuthStore } from "../stores/useAuthStore";
import { Role } from "../types/auth";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: Role[];
}

export default function RoleRoute({ allowedRoles }: Props) {
  const user = useAuthStore().user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

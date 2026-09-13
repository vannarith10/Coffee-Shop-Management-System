//
// routes/RoleRoute.tsx
//
import { useAuthStore } from "../stores/useAuthStore";
import { type RoleType } from "@/types";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  allowedRoles: RoleType[];
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

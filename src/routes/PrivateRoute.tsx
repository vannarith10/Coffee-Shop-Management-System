//
// security/PrivateRoute.tsx
//

import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/ui/Loader";
import { useAuthStore } from "../stores/useAuthStore";

export default function PrivateRoute() {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  if (!initialized) {
    return (
      <div className="relative">
        <div className="absolute h-screen w-screen inset-0 bg-gray-500/50 backdrop-blur-xs flex flex-col items-center justify-center gap-4">
          <Loader size={100} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

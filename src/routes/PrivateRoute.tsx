// security/PrivateRoute.tsx
//
import { useAuth } from "../contexts/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/ui/Loader";


export default function PrivateRoute() {
    
  const { user, checkingUser } = useAuth();

  if (checkingUser) {
    return (
        <div className="relative">
          <div className="absolute h-screen w-screen inset-0 bg-gray-500/50 backdrop-blur-xs flex flex-col items-center justify-center gap-4">
            <Loader size={100}/>
          </div>
        </div>
      );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet/>
}

//
// pages/UnauthorizedPage.tsx
//
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export default function UnauthorizedPage() {
  const clearUserData = useAuthStore().logout;

  useEffect(() => {
    clearUserData();
  }, [clearUserData]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background-primary">
      <h1 className="text-2xl font-bold text-text-primary">
        You don't have permission to access this page.
      </h1>
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 whitespace-nowrap h-14 w-40 rounded-md font-semibold hover:[word-spacing:10px] transition-all duration-300 ease-out"
      >
        Go to Login <MoveRight />
      </Link>
    </div>
  );
}

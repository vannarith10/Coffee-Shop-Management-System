// components/ui/LogoutButton.tsx
//
import { useAuth } from "../../contexts/useAuth";
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex justify-center items-center gap-2 hover:gap-6 text-orange-500 font-bold bg-background-secondary rounded-md w-full py-4 cursor-pointer hover:bg-background-secondary-hover transition-all duration-500 ease-out"
    >
      <LogOut/> Logout
    </button>
  );
}

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
      className="px-4 flex justify-center items-center gap-2 hover:gap-4 text-white font-bold bg-text-error/80 rounded-md w-full py-2 cursor-pointer hover:bg-text-error transition-all duration-500 ease-out"
    >
      Logout <LogOut/>
    </button>
  );
}

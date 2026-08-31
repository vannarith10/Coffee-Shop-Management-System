//
// layouts/AdminLayout.tsx
//
import { useEffect, useState } from "react";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  //
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  function handleResize() {
    setIsDesktop(window.innerWidth >= 768);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-screen flex flex-col md:flex-row">
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Outlet />
    </div>
  );
}

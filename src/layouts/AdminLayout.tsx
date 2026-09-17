import Navbar from "@/features/admin/components/Navbar";
import Sidebar from "@/features/admin/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="w-screen flex flex-col md:flex-row ">
      {/* ------------------------------
                  Desktop
      ------------------------------- */}
      <Sidebar />

      {/* ------------------------------
                  Mobile
      ------------------------------- */}
      <Navbar />

      {/* ------------------------------
                  Content
      ------------------------------- */}
      <main className=" flex-1 ">
        <Outlet />
      </main>
    </div>
  );
}

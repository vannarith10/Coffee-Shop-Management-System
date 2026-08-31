//
// layouts/AdminLayout.tsx
//
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";
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

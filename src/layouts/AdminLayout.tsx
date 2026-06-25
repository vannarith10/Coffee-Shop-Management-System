// layouts/AdminLayout.tsx
//
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    //
  return (
    <div className="w-screen flex flex-col md:flex-row">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
}

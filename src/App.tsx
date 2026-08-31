//
// App.tsx
//
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RoleRoute from "./routes/RoleRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { Role } from "./types/auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import BaristaDashboard from "./pages/barista/BaristaDashboard";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "sonner";
import StaffTab from "./pages/admin/StaffTab";
import CategoryTab from "./pages/admin/CategoryTab";
import InventoryTab from "./pages/admin/InventoryTab";
import ProductTab from "./pages/admin/ProductTab";
import ReportTab from "./pages/admin/ReportTab";
import SettingTab from "./pages/admin/SettingTab";
import ProductDetailPage from "./pages/admin/ProductDetailPage";
import CashierLayout from "./layouts/CashierLayout";
import ConfirmOrder from "./pages/cashier/ConfirmOrder";
import { GlassFilter } from "./components/ui/GlassFilter";
import { websocketManager } from "./websocket/websocket-manager";
import { useEffect } from "react";
import { authStorage } from "./utils/auth-storage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/login"} replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      // -----------------------------------------------------
      // ADMIN ROUTE
      // -----------------------------------------------------
      {
        element: <RoleRoute allowedRoles={[Role.ADMIN]} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={"dashboard"} replace />,
              },
              {
                path: "dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "staff",
                element: <StaffTab />,
              },
              {
                path: "category",
                element: <CategoryTab />,
              },
              {
                path: "inventory",
                element: <InventoryTab />,
              },
              {
                path: "products",
                element: <ProductTab />,
                children: [
                  {
                    path: ":id",
                    element: <ProductDetailPage />,
                  },
                ],
              },
              {
                path: "reports",
                element: <ReportTab />,
              },
              {
                path: "settings",
                element: <SettingTab />,
              },
            ],
          },
        ],
      },
      // -----------------------------------------------------
      // CASHIER ROUTE
      // -----------------------------------------------------
      {
        element: <RoleRoute allowedRoles={[Role.CASHIER]} />,
        children: [
          {
            path: "/cashier",
            element: <CashierLayout />,
            children: [
              {
                index: true,
                element: <CashierDashboard />,
              },
              {
                path: "confirm-order/:id",
                element: <ConfirmOrder />,
              },
            ],
          },
        ],
      },
      // -----------------------------------------------------
      // BARISTA ROUTE
      // -----------------------------------------------------
      {
        element: <RoleRoute allowedRoles={[Role.BARISTA]} />,
        children: [
          {
            path: "/barista",
            element: <BaristaDashboard />,
          },
        ],
      },
    ],
  },
  // Catch-All 404 route
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  const isAuthenticated = !!authStorage.getUser();

  useEffect(() => {
    if (!isAuthenticated) {
      websocketManager.disconnect();
      return;
    }

    websocketManager.connect();
  }, [isAuthenticated]);

  return (
    <div className="w-screen min-w-80 min-h-screen bg-background-primary transition-colors duration-500 ease-out">
      <GlassFilter />
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;

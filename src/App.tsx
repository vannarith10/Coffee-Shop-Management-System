import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import PageNotFound from "./features/auth/pages/PageNotFound";
import UnauthorizedPage from "./features/auth/pages/UnauthorizedPage";
import RoleRoute from "./routes/RoleRoute";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import CashierDashboard from "./features/cashier/pages/CashierDashboard";
import BaristaDashboard from "./features/barista/pages/BaristaDashboard";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "sonner";
import StaffTab from "./features/admin/pages/StaffTab";
import CategoryTab from "./features/admin/pages/CategoryTab";
import ProductTab from "./features/admin/pages/ProductTab";
import ReportTab from "./features/admin/pages/ReportTab";
import SettingTab from "./features/admin/pages/SettingTab";
import ProductDetailPage from "./features/admin/pages/ProductDetailPage";
import CashierLayout from "./layouts/CashierLayout";
import ConfirmOrder from "./features/cashier/pages/ConfirmOrder";
import { GlassFilter } from "@/components/ui";
import { websocketManager } from "./websocket/websocket-manager";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";

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
      //
      // ADMIN ROUTE
      //
      // -----------------------------------------------------
      {
        element: <RoleRoute allowedRoles={["ADMIN"]} />,
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
      //
      // CASHIER ROUTE
      //
      // -----------------------------------------------------
      {
        element: <RoleRoute allowedRoles={["CASHIER"]} />,
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
      //
      // BARISTA ROUTE
      //
      // -----------------------------------------------------
      {
        element: <RoleRoute allowedRoles={["BARISTA"]} />,
        children: [
          {
            path: "/barista",
            element: <BaristaDashboard />,
          },
        ],
      },
    ],
  },
  // ----------------------------
  //
  // Catch-All 404 route
  //
  // ----------------------------
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      websocketManager.connect();
    } else {
      websocketManager.disconnect();
    }
  }, [accessToken]);

  return (
    <div className="w-screen min-w-80 min-h-screen bg-background-primary transition-colors duration-500 ease-out">
      <GlassFilter />
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;

// App.tsx
//
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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



const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute><LoginPage/></PublicRoute>,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage/>,
  },
  {
    element: <PrivateRoute/>,
    children: [
      {
        element: <RoleRoute allowedRoles={[Role.ADMIN]}/>,
        children: [
          {
            path: "/admin",
            element: <AdminLayout/>,
            children: [
              {
                index: true,
                element: <AdminDashboard/>,
              },
              {
                path: "staff",
                element: <StaffTab/>
              },
              {
                path: "category",
                element: <h2>Category page</h2>
              },
              {
                path: "inventory",
                element: <h2>Inventory Screen</h2>
              },
              {
                path: "products",
                element: <h2>Product Screen</h2>
              },
              {
                path: "reports",
                element: <h2>Report Screen</h2>
              },
              {
                path: "settings",
                element: <h2>Setting Screen</h2>
              }
            ]
          }
        ]
      },
      {
        element: <RoleRoute allowedRoles={[Role.CASHIER]}/>,
        children: [
          {
            path: "/cashier",
            element: <CashierDashboard/>
          }
        ]
      },
      {
        element: <RoleRoute allowedRoles={[Role.BARISTA]}/>,
        children: [
          {
            path: "/barista",
            element: <BaristaDashboard/>
          }
        ]
      }
    ]
  },
  // Catch-All 404 route
  {
    path: "*",
    element: <PageNotFound/>
  }
]);


function App() {
  return (
    <div className="w-screen min-w-100 bg-background-primary transition-colors duration-500 ease-out">
      <RouterProvider router={router}/>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;

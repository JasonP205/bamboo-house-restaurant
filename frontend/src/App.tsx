import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { Toast } from "@heroui/react";
import BranchesPage from "./pages/branches/BranchesPage";
import ManagerPanel from "./pages/auth/ManagerPanel";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BranchDetail from "./pages/branches/BranchDetail";
import { useAuthStore } from "@/stores/useAuthStore";
import GoogleCallback from "./pages/auth/GoogleCallback";
import DishDetail from "./pages/dishes/DishDetail";
import MenuPage from "./pages/dishes/MenuPage";
import PlaceOrder from "./pages/orders/customer/PlaceOrder";
import CustomerLayOut from "./components/ui/CustomerLayOut";
import { useEffect } from "react";
import { useSocketStore } from "./stores/useSocketStore";
import OrderMonitor from "./pages/orders/staff/OrderMonitor";
import LandingPage from "./pages/LandingPage";

function App() {
  const { getDeviceId, deviceId } = useAuthStore();
  useEffect(() => {
    if (!deviceId) {
      getDeviceId();
    }
  }, [deviceId]);
  return (
    <>
      <Toast.Provider placement="top" className="z-100" />
      <Router>
        <div className="min-w-screen min-h-svh">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="login-success" element={<GoogleCallback />} />

            <Route element={<ProtectedRoute requireLogin />}>
              <Route path="branches" element={<Outlet />}>
                <Route index element={<BranchesPage />} />
                <Route path=":branchId" element={<BranchDetail />} />
              </Route>
              <Route path="menu" element={<Outlet />}>
                <Route index element={<MenuPage />} />
                <Route path=":dishId" element={<DishDetail />} />
              </Route>

              <Route path="orders" element={<OrderMonitor />} />
            </Route>
            <Route path="order" element={<CustomerLayOut />}>
              <Route index element={<PlaceOrder />} />
            </Route>

            <Route path="auth" element={<Outlet />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="manager" element={<ManagerPanel />} />
            </Route>

            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;

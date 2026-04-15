import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { Toast, ToastQueue } from "@heroui/react";
import BranchesPage from "./pages/branches/BranchesPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BranchDetail from "./pages/branches/BranchDetail";
import { useAuthStore } from "@/stores/useAuthStore";
import GoogleCallback from "./pages/auth/GoogleCallback";
import DishDetail from "./pages/dishes/DishDetail";
import MenuPage from "./pages/dishes/MenuPage";
import PlaceOrder from "./pages/orders/customer/PlaceOrder";
import CustomerLayOut from "./components/ui/CustomerLayOut";
import { useEffect } from "react";
import OrderMonitor from "./pages/orders/staff/OrderMonitor";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import HistoryOrder from "./pages/orders/staff/HistoryOrder";
import StaffProfilePage from "./pages/staff/StaffProfilePage";

function App() {
  const { getDeviceId, deviceId } = useAuthStore();
  const { role } = useAuthStore();
  useEffect(() => {
    if (!deviceId) {
      getDeviceId();
    }
  }, [deviceId]);
  const maxQueue = new ToastQueue({ maxVisibleToasts: 2 });
  return (
    <>
      <Toast.Provider queue={maxQueue} placement="top" className="z-100" />
      <Router>
        <div className="min-w-screen min-h-svh">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="login-callback" element={<GoogleCallback />} />

            <Route element={<ProtectedRoute requireLogin />}>
              {role === "manager" && (
                <>
                  <Route path="branches" element={<Outlet />}>
                    <Route index element={<BranchesPage />} />
                    <Route path=":branchId" element={<BranchDetail />} />
                  </Route>
                  <Route path="menu" element={<Outlet />}>
                    <Route index element={<MenuPage />} />
                    <Route path=":dishId" element={<DishDetail />} />
                  </Route>
                </>
              )}

              <Route path="orders" element={<OrderMonitor />} />
              <Route path="history" element={<HistoryOrder />} />
              <Route path="staff/:staffId" element={<StaffProfilePage />} />
            </Route>
            <Route path="order" element={<CustomerLayOut />}>
              <Route index element={<PlaceOrder />} />
            </Route>

            <Route path="auth" element={<Outlet />}>
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;

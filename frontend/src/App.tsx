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
import Layout from "./components/ui/Layout";
import ManagerPanel from "./pages/auth/ManagerPanel";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BranchDetail from "./pages/branches/BranchDetail";
import { useAuthStore } from "@/stores/useAuthStore"
import GoogleCallback from "./pages/auth/GoogleCallback";

function App() {
  const { getDeviceId, deviceId } = useAuthStore();
  if (!deviceId) {
    getDeviceId();
  }
  return (
    <>
      <Toast.Provider placement="top" className="z-100" />
      <Router>
        <div className="min-w-screen min-h-svh">
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="login-success" element={<GoogleCallback />} />

            <Route element={<ProtectedRoute requireLogin />}>
              <Route path="app" element={<Outlet />}>
                <Route index element={<Layout />}></Route>

                <Route path="branches" element={<Layout />}>
                  <Route index element={<BranchesPage />} />
                  <Route path=":branchId" element={<BranchDetail />} />
                </Route>

                <Route path="orders" element={<Outlet />} >
                  <Route path="place-order" element={<h1>Place Order</h1>} />
                </Route>

              </Route>
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

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  requireLogin?: boolean;
  requireBranchId?: boolean;
}

const ProtectedRoute = ({
  requireLogin,
  requireBranchId,
}: ProtectedRouteProps) => {
  const { accessToken, branchId, user } = useAuthStore();

  // 🔥 check login
  if (requireLogin && !accessToken && !user) {
    const currentUrl = window.location.href;
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(currentUrl)}`} replace />;
  }

  // 🔥 check branch
  if (requireBranchId && !branchId) {
    return <Navigate to="/auth/select-branch" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
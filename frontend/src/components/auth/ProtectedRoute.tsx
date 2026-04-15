import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import Layout from "../ui/Layout";

interface ProtectedRouteProps {
  requireLogin?: boolean;
  requireBranchId?: boolean;
}

const ProtectedRoute = ({
  requireLogin,
  requireBranchId,
}: ProtectedRouteProps) => {
  const { accessToken, branchId, user } = useAuthStore();

  if (requireLogin && !accessToken && !user) {
    const currentUrl = window.location.href;
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(currentUrl)}`} replace />;
  }

  if (requireBranchId && !branchId) {
    return <Navigate to="/auth/select-branch" replace />;
  }

  return <Layout/>;
};

export default ProtectedRoute;
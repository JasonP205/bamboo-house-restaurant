import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const BranchRequired = () => {
  const { branchId } = useAuthStore();

  if (branchId) {
    return <Navigate to="/branches/select-branch" replace />;
  }

  return <Outlet></Outlet>;
};

export default BranchRequired;

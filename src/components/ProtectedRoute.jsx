import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

/**
 * ProtectedRoute for role-based access (user/admin)
 * @param {ReactNode} children
 * @param {Array<string>} allowedRoles - ["user", "admin"]
 */
const ProtectedRoute = ({ children, allowedRoles = ["user", "admin"] }) => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  // If not authenticated, redirect to login
  if (!auth.status) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated but not allowed role, redirect to home
  if (!allowedRoles.includes(auth.userData?.role)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and allowed role, render children
  return children;
};

export default ProtectedRoute;

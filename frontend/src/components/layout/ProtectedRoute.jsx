import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store.js";

const roleRedirects = {
  ADMIN: "/admin/dashboard",
  USER: "/user/stores",
  STORE_OWNER: "/owner/dashboard",
};

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleRedirects[user.role]} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Outlet />;

  return <Navigate to={roleRedirects[user.role]} replace />;
}

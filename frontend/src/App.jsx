import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./components/layout/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage.jsx";
import AdminDashboardPage from "./pages/admin/DashboardPage.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import UserDetailPage from "./pages/admin/UserDetailPage.jsx";
import StoresPage from "./pages/admin/StoresPage.jsx";
import UserStoresPage from "./pages/user/StoresPage.jsx";
import OwnerDashboardPage from "./pages/owner/DashboardPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/stores" element={<StoresPage />} />
            <Route path="/admin/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/user/stores" element={<UserStoresPage />} />
            <Route path="/user/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["STORE_OWNER"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

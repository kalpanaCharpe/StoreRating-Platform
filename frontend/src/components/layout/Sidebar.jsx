import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Store, Star, LogOut, KeyRound } from "lucide-react";
import { useAuthStore } from "../../store/auth.store.js";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "Users", to: "/admin/users", icon: <Users className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "Stores", to: "/admin/stores", icon: <Store className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "Change Password", to: "/admin/change-password", icon: <KeyRound className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "Stores", to: "/user/stores", icon: <Store className="h-4 w-4" />, roles: ["USER"] },
  { label: "Change Password", to: "/user/change-password", icon: <KeyRound className="h-4 w-4" />, roles: ["USER"] },
  { label: "Dashboard", to: "/owner/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["STORE_OWNER"] },
  { label: "Change Password", to: "/owner/change-password", icon: <KeyRound className="h-4 w-4" />, roles: ["STORE_OWNER"] },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const visible = navItems.filter((item) => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-100 bg-white">
      <div className="border-b border-gray-100 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Star className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-gray-900">StoreRating</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {visible.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="mb-2 rounded-lg px-3 py-2">
          <p className="truncate text-xs font-medium text-gray-800">{user?.name}</p>
          <p className="truncate text-xs text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

import { useEffect, useState } from "react";
import { Users, Store, Star } from "lucide-react";
import { dashboardApi } from "../../api/dashboard.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Alert from "../../components/ui/Alert.jsx";

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardApi
      .stats()
      .then((r) => setStats(r.data))
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform-wide overview</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" /> Loading...
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={<Users className="h-5 w-5 text-brand-600" />}
            color="bg-brand-50"
          />
          <StatCard
            label="Total Stores"
            value={stats.totalStores}
            icon={<Store className="h-5 w-5 text-emerald-600" />}
            color="bg-emerald-50"
          />
          <StatCard
            label="Total Ratings"
            value={stats.totalRatings}
            icon={<Star className="h-5 w-5 text-amber-500" />}
            color="bg-amber-50"
          />
        </div>
      )}
    </div>
  );
}

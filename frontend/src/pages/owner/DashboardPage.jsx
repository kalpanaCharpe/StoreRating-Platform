import { useEffect, useState } from "react";
import { Star, Users, MapPin, Mail } from "lucide-react";
import { storesApi } from "../../api/stores.js";
import { formatRating } from "../../utils/helpers.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Alert from "../../components/ui/Alert.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StarRating from "../../components/ui/StarRating.jsx";

export default function OwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    storesApi
      .ownerDashboard()
      .then((r) => setData(r.data))
      .catch(() => setError("Failed to load dashboard. Make sure your store is set up."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Your Store</h1>
        <p className="mt-0.5 text-sm text-gray-500">Ratings and customer overview</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" /> Loading...
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      {data && (
        <>
          <div className="card mb-6 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Store Info
            </h2>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">{data.store.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                {data.store.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {data.store.address}
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <p className="text-sm text-gray-500">Average Rating</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-4xl font-bold text-gray-900">
                  {data.averageRating !== null ? Number(data.averageRating).toFixed(1) : "—"}
                </p>
                <div className="mb-1">
                  <StarRating value={Math.round(data.averageRating ?? 0)} readonly size="sm" />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Based on {data.totalRatings} rating{data.totalRatings !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="card flex items-center gap-4 p-6">
              <div className="rounded-xl bg-brand-50 p-3">
                <Users className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Customers rated</p>
                <p className="text-3xl font-bold text-gray-900">{data.totalRatings}</p>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Customer Ratings</h2>
            </div>
            {data.ratedUsers.length === 0 ? (
              <EmptyState
                title="No ratings yet"
                description="Once customers rate your store, they'll appear here."
              />
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-600">Customer</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-600">Rating</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.ratedUsers.map((r) => (
                    <tr key={r.ratingId} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{r.user.name}</td>
                      <td className="px-5 py-3 text-gray-500">{r.user.email}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <StarRating value={r.value} readonly size="sm" />
                          <span className="text-xs text-gray-500">{r.value}/5</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(r.ratedAt).toLocaleDateString(undefined, {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

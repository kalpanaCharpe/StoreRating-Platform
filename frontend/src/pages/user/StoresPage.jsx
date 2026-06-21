import { useEffect, useState, useCallback } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { ratingsApi } from "../../api/ratings.js";
import { getErrorMessage, formatRating } from "../../utils/helpers.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Alert from "../../components/ui/Alert.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import StarRating from "../../components/ui/StarRating.jsx";
import SortButton from "../../components/ui/SortButton.jsx";

export default function UserStoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [ratingLoading, setRatingLoading] = useState(null);
  const [ratingError, setRatingError] = useState("");

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ratingsApi.myStores({ search: search || undefined, sortBy, order });
      setStores(res.data);
    } catch {
      setError("Failed to load stores.");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, order]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    if (field === sortBy) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setOrder("asc"); }
  };

  const handleRate = async (storeId, value, existing) => {
    setRatingLoading(storeId);
    setRatingError("");
    try {
      if (existing !== null) await ratingsApi.update(storeId, value);
      else await ratingsApi.submit(storeId, value);
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, userRating: value } : s))
      );
    } catch (err) {
      setRatingError(getErrorMessage(err));
    } finally {
      setRatingLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Stores</h1>
        <p className="mt-0.5 text-sm text-gray-500">Browse and rate all registered stores</p>
      </div>

      {error && <Alert type="error" message={error} />}
      {ratingError && (
        <div className="mb-4">
          <Alert type="error" message={ratingError} onClose={() => setRatingError("")} />
        </div>
      )}

      <div className="card mb-5 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="input-base pl-9"
            placeholder="Search by name or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : stores.length === 0 ? (
          <EmptyState title="No stores found" description="Try a different search term." />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Name" field="name" current={sortBy} order={order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Address" field="address" current={sortBy} order={order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Overall Rating</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Your Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{store.name}</div>
                    <div className="text-xs text-gray-400">
                      {store.totalRatings} rating{store.totalRatings !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-1.5 text-gray-500">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-[200px] truncate">{store.address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Star className={`h-4 w-4 ${store.averageRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      <span className="text-sm font-medium text-gray-700">
                        {formatRating(store.averageRating)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {ratingLoading === store.id ? (
                      <Spinner size="sm" />
                    ) : (
                      <div className="flex flex-col gap-1">
                        <StarRating
                          value={store.userRating}
                          onChange={(val) => handleRate(store.id, val, store.userRating)}
                          size="sm"
                        />
                        {store.userRating !== null && (
                          <span className="text-xs text-gray-400">Your rating: {store.userRating}/5</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { usersApi } from "../../api/users.js";
import { roleBadgeClass, roleLabel, formatRating } from "../../utils/helpers.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Alert from "../../components/ui/Alert.jsx";

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="text-sm text-gray-900">{value ?? "—"}</dd>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    usersApi
      .getOne(id)
      .then((r) => setUser(r.data))
      .catch(() => setError("User not found or failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" /> Loading...
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      {user && (
        <div className="max-w-xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-base font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
              <span className={`badge ${roleBadgeClass(user.role)}`}>{roleLabel(user.role)}</span>
            </div>
          </div>

          <div className="card divide-y divide-gray-50 px-6">
            <DetailRow label="Name" value={user.name} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Address" value={user.address} />
            <DetailRow label="Role" value={roleLabel(user.role)} />
            <DetailRow
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric", month: "long", day: "numeric",
              })}
            />
            {user.role === "STORE_OWNER" && user.store && (
              <>
                <DetailRow label="Store" value={user.store.name} />
                <DetailRow
                  label="Avg. Rating"
                  value={
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{formatRating(user.store.averageRating)}</span>
                    </div>
                  }
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

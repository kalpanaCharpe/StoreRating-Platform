import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Eye } from "lucide-react";
import { usersApi } from "../../api/users.js";
import { createUserSchema } from "../../utils/validation.js";
import { getErrorMessage, roleBadgeClass, roleLabel } from "../../utils/helpers.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Alert from "../../components/ui/Alert.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import SortButton from "../../components/ui/SortButton.jsx";
import Modal from "../../components/ui/Modal.jsx";
import FormField from "../../components/ui/FormField.jsx";

const ROLES = ["ADMIN", "USER", "STORE_OWNER"];

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [filters, setFilters] = useState({
    name: "", email: "", address: "", role: "",
    sortBy: "createdAt", order: "desc",
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({
        name: filters.name || undefined,
        email: filters.email || undefined,
        address: filters.address || undefined,
        role: filters.role || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
      });
      setUsers(res.data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleCreate = async (data) => {
    setCreating(true);
    setCreateError("");
    try {
      await usersApi.create(data);
      setShowModal(false);
      reset();
      fetchUsers();
    } catch (err) {
      setCreateError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCreateError("");
    reset();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-0.5 text-sm text-gray-500">{users.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add user
        </button>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="card mb-5 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="input-base pl-9"
              placeholder="Name"
              value={filters.name}
              onChange={(e) => setFilters((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <input
            className="input-base"
            placeholder="Email"
            value={filters.email}
            onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            className="input-base"
            placeholder="Address"
            value={filters.address}
            onChange={(e) => setFilters((p) => ({ ...p, address: e.target.value }))}
          />
          <select
            className="input-base"
            value={filters.role}
            onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
          >
            <option value="">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{roleLabel(r)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : users.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your filters." />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Name" field="name" current={filters.sortBy} order={filters.order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Email" field="email" current={filters.sortBy} order={filters.order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Address</th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Role" field="role" current={filters.sortBy} order={filters.order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{user.address ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${roleBadgeClass(user.role)}`}>{roleLabel(user.role)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title="Add new user" onClose={closeModal}>
          {createError && <div className="mb-4"><Alert type="error" message={createError} /></div>}
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <FormField label="Full name" error={errors.name?.message} required hint="20–60 characters">
              <input {...register("name")} className="input-base" placeholder="Full name" />
            </FormField>
            <FormField label="Email" error={errors.email?.message} required>
              <input {...register("email")} type="email" className="input-base" placeholder="Email" />
            </FormField>
            <FormField label="Address" error={errors.address?.message}>
              <input {...register("address")} className="input-base" placeholder="Address (optional)" />
            </FormField>
            <FormField label="Password" error={errors.password?.message} required hint="8–16 chars, uppercase + special char">
              <input {...register("password")} type="password" className="input-base" placeholder="••••••••" />
            </FormField>
            <FormField label="Role" error={errors.role?.message} required>
              <select {...register("role")} className="input-base">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </FormField>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? <Spinner size="sm" /> : "Create user"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

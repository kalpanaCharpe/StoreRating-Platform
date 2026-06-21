import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Plus, Pencil, Trash2, Star } from "lucide-react";
import { storesApi } from "../../api/stores.js";
import { storeSchema } from "../../utils/validation.js";
import { getErrorMessage, formatRating } from "../../utils/helpers.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Alert from "../../components/ui/Alert.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import SortButton from "../../components/ui/SortButton.jsx";
import Modal from "../../components/ui/Modal.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import FormField from "../../components/ui/FormField.jsx";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(storeSchema),
  });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storesApi.list({ search: search || undefined, sortBy, order });
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

  const openCreate = () => {
    reset({ name: "", email: "", address: "", ownerId: "" });
    setFormError("");
    setModalMode("create");
  };

  const openEdit = (store) => {
    setEditTarget(store);
    reset({ name: store.name, email: store.email, address: store.address, ownerId: store.owner?.id ?? "" });
    setFormError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
    reset();
    setFormError("");
  };

  const onSubmit = async (data) => {
    setFormLoading(true);
    setFormError("");
    try {
      const payload = { ...data, ownerId: data.ownerId || undefined };
      if (modalMode === "create") await storesApi.create(payload);
      else if (editTarget) await storesApi.update(editTarget.id, payload);
      closeModal();
      fetchStores();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await storesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchStores();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Stores</h1>
          <p className="mt-0.5 text-sm text-gray-500">{stores.length} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add store
        </button>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError("")} />
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
          <EmptyState title="No stores found" description="Add your first store to get started." />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Name" field="name" current={sortBy} order={order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Email" field="email" current={sortBy} order={order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton label="Address" field="address" current={sortBy} order={order} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Rating</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{store.name}</td>
                  <td className="px-4 py-3 text-gray-500">{store.email}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{store.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Star className={`h-3.5 w-3.5 ${store.averageRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      <span className="text-xs">{formatRating(store.averageRating)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(store)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(store)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalMode && (
        <Modal title={modalMode === "create" ? "Add new store" : "Edit store"} onClose={closeModal}>
          {formError && <div className="mb-4"><Alert type="error" message={formError} /></div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Store name" error={errors.name?.message} required hint="20–60 characters">
              <input {...register("name")} className="input-base" placeholder="Store name" />
            </FormField>
            <FormField label="Email" error={errors.email?.message} required>
              <input {...register("email")} type="email" className="input-base" placeholder="store@example.com" />
            </FormField>
            <FormField label="Address" error={errors.address?.message} required>
              <textarea {...register("address")} className="input-base resize-none" rows={2} placeholder="Full address" />
            </FormField>
            <FormField label="Owner ID" error={errors.ownerId?.message} hint="Optional — paste a STORE_OWNER user ID">
              <input {...register("ownerId")} className="input-base" placeholder="User ID (optional)" />
            </FormField>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" disabled={formLoading} className="btn-primary">
                {formLoading ? <Spinner size="sm" /> : modalMode === "create" ? "Create store" : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete store"
          description={`Are you sure you want to delete "${deleteTarget.name}"? This will remove all associated ratings.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

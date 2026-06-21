import Modal from "./Modal.jsx";
import Spinner from "./Spinner.jsx";

export default function ConfirmDialog({ title, description, onConfirm, onCancel, loading }) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="mb-6 text-sm text-gray-600">{description}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

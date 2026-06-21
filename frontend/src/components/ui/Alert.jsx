import { AlertCircle, CheckCircle, X } from "lucide-react";

export default function Alert({ type, message, onClose }) {
  const styles =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-green-50 border-green-200 text-green-800";

  const Icon = type === "error" ? AlertCircle : CheckCircle;

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

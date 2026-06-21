import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function SortButton({ label, field, current, order, onSort }) {
  const active = current === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      {label}
      {active ? (
        order === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-brand-600" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-brand-600" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
      )}
    </button>
  );
}

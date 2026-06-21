import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "No records found.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <SearchX className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

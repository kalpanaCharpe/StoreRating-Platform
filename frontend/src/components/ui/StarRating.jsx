import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ value, onChange, readonly = false, size = "md" }) {
  const [hovered, setHovered] = useState(null);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const active = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(null)}
          className={readonly ? "cursor-default" : "cursor-pointer focus:outline-none"}
        >
          <Star
            className={`${iconSize} transition-colors ${
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

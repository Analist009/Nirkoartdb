import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  readonly?: boolean;
}

export function ImageRating({ rating, onRate, readonly = false }: ImageRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          onClick={() => !readonly && onRate(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(null)}
          disabled={readonly}
          className={cn(
            "p-1 transition-colors",
            !readonly && "hover:text-yellow-500",
            value <= (hoverRating ?? rating) ? "text-yellow-400" : "text-gray-300"
          )}
        >
          <Star className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
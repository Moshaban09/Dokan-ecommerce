import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  className?: string;
  size?: number;
}

export function RatingStars({
  rating,
  maxRating = 5,
  className,
  size = 16,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(maxRating)].map((_, i) => {
        const isFull = i + 1 <= Math.floor(rating);
        const isHalf = !isFull && i < rating;

        return (
          <div key={i} className="relative">
            <Star
              size={size}
              className={cn(
                "fill-gray-200 text-gray-200",
                isFull && "fill-yellow-400 text-yellow-400",
                isHalf && "text-gray-200"
              )}
            />
            {isHalf && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${(rating % 1) * 100}%` }}
              >
                <Star size={size} className="fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  totalReviews?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  totalReviews = 0,
}) => {
  const safeRating = Math.min(Math.max(rating, 0), 5);
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2 font-inter">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}

      {hasHalfStar && (
        <div className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}

      <span className="ml-2 font-semibold text-sm text-foreground">
        {safeRating.toFixed(1)}
      </span>
      <span className="text-sm text-muted-foreground">
        ({totalReviews} reviews)
      </span>
    </div>
  );
};

export default RatingStars;

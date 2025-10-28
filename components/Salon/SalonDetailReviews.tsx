"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingStats {
  average: number;
  totalReviews: number;
  breakdown: Record<number, number>;
}

interface SalonReviewsSectionProps {
  stats?: RatingStats;
  onWriteReview?: () => void;
}

const SalonDetailReview: React.FC<SalonReviewsSectionProps> = ({
  stats,
  onWriteReview,
}) => {
  if (!stats) {
    return (
      <section className="mt-5">
        <h2 className="text-2xl font-extrabold text-foreground mb-4">
          Reviews & Ratings
        </h2>
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 text-center text-muted-foreground">
          No review data available for this salon.
        </div>
      </section>
    );
  }

  const { average, totalReviews, breakdown } = stats;
  const hasReviews = totalReviews > 0;
  const maxCount = Math.max(...Object.values(breakdown));

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">
          Reviews & Ratings
        </h2>
        <button
          onClick={onWriteReview}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-shadow shadow-sm font-inter cursor-pointer"
        >
          Write a Review
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-8 text-center font-inter">
        <h3 className="text-5xl font-bold text-foreground">
          {average.toFixed(1)}
        </h3>

        <div className="flex justify-center mt-2 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(average)
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>

        <div className="mt-6 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = breakdown[stars] || 0;
            const barWidth = Math.round((count / maxCount) * 100); // ✅ inside map
            return (
              <div
                key={stars}
                className="flex items-center justify-between text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-1 w-16">
                  <span>{stars}</span>
                  <Star className="w-4 h-4 fill-accent text-accent" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full mx-2 overflow-hidden">
                  <div
                    className={`h-full bg-accent rounded-full transition-all w-[${barWidth}%]`}
                  ></div>
                </div>
                <span className="w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {!hasReviews && (
        <div className="mt-6 bg-card border border-border rounded-2xl shadow-sm p-6 text-center text-sm text-muted-foreground">
          No reviews yet. Be the first to review this salon!
        </div>
      )}
    </section>
  );
};

export default SalonDetailReview;

"use client";

import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { API_BASE_URL } from "@/libs/api/config";
import { addReview } from "@/libs/api/reviews";

interface RatingStats {
  average: number;
  totalReviews: number;
  breakdown: Record<number, number>;
}

interface Review {
  rating: number;
  comment: string;
  created_at: string;
  customer_name: string;
}

interface SalonReviewsSectionProps {
  salonId?: string | number;
  onWriteReview?: () => void;
}

const SalonDetailReview: React.FC<SalonReviewsSectionProps> = ({
  salonId,
  onWriteReview,
}) => {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!salonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/reviews/salon/${salonId}`
        );

        if (response.ok) {
          const data = await response.json();
          setStats({
            average: data.average || 0,
            totalReviews: data.totalReviews || 0,
            breakdown: data.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          });
          setReviews(data.reviews || []);
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: response.statusText }));
          console.error(
            "Failed to fetch reviews:",
            errorData.error || response.statusText
          );
          setStats({
            average: 0,
            totalReviews: 0,
            breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          });
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setStats({
          average: 0,
          totalReviews: 0,
          breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [salonId]);

  const handleOpenReviewModal = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to write a review");
      window.location.href = "/sign-in";
      return;
    }
    onWriteReview?.();
    setShowReviewModal(true);
    setReviewError("");
    setReviewSuccess(false);
  };

  const handleSubmitReview = async () => {
    if (!salonId) return;

    if (reviewRating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError("Please write a comment");
      return;
    }

    setSubmitting(true);
    setReviewError("");

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        setReviewError("Please login to write a review");
        return;
      }

      // For now, we'll allow reviews without appointment_id (can be made optional)
      // In a real scenario, you'd fetch user's past appointments and let them select one
      const result = await addReview({
        appointment_id: null, // Optional - can be null if reviewing salon directly
        salon_id: parseInt(String(salonId)),
        staff_id: null, // Optional - can be null if reviewing salon directly
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      if (result.error) {
        setReviewError(result.error);
      } else {
        setReviewSuccess(true);
        setReviewComment("");
        setReviewRating(0);
        // Refresh reviews after a short delay
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
          // Reload reviews
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-5">
        <h2 className="text-2xl font-extrabold text-foreground mb-4">
          Reviews & Ratings
        </h2>
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 text-center text-muted-foreground">
          Loading reviews...
        </div>
      </section>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <section className="mt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-foreground">
            Reviews & Ratings
          </h2>
          <button
            onClick={handleOpenReviewModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-shadow shadow-sm font-inter cursor-pointer"
          >
            Write a Review
          </button>
        </div>
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No reviews yet. Be the first to review this salon!
          </p>
          <button
            onClick={handleOpenReviewModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-6 py-2 rounded-lg transition-shadow shadow-sm font-inter cursor-pointer"
          >
            Write the First Review
          </button>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background border border-border rounded-2xl shadow-lg max-w-md w-full p-6 font-inter">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Write a Review
                </h3>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewError("");
                    setReviewSuccess(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reviewSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600 fill-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    Thank you for your review!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your review has been submitted.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`transition-colors ${
                            star <= reviewRating
                              ? "text-accent fill-accent"
                              : "text-muted-foreground"
                          }`}
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star className="w-8 h-8" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="review-comment"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Your Review *
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this salon..."
                      rows={5}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-inter"
                    />
                  </div>

                  {reviewError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {reviewError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setReviewError("");
                      }}
                      className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={
                        submitting ||
                        reviewRating === 0 ||
                        !reviewComment.trim()
                      }
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  const { totalReviews } = stats;
  const hasReviews = totalReviews > 0;

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">
          Reviews & Ratings
        </h2>
        <button
          onClick={handleOpenReviewModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-shadow shadow-sm font-inter cursor-pointer"
        >
          Write a Review
        </button>
      </div>

      {/* Individual Reviews List */}
      {reviews.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Customer Reviews
          </h3>
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl shadow-sm p-6 font-inter"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {review.customer_name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {review.customer_name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-foreground mt-3 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!hasReviews && (
        <div className="mt-6 bg-card border border-border rounded-2xl shadow-sm p-6 text-center text-sm text-muted-foreground">
          No reviews yet. Be the first to review this salon!
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl shadow-lg max-w-md w-full p-6 font-inter">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">
                Write a Review
              </h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewError("");
                  setReviewSuccess(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600 fill-green-600" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  Thank you for your review!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your review has been submitted.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`transition-colors ${
                          star <= reviewRating
                            ? "text-accent fill-accent"
                            : "text-muted-foreground"
                        }`}
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className="w-8 h-8" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="review-comment"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Your Review *
                  </label>
                  <textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this salon..."
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-inter"
                  />
                </div>

                {reviewError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {reviewError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewError("");
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={
                      submitting || reviewRating === 0 || !reviewComment.trim()
                    }
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SalonDetailReview;

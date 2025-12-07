"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Edit2 } from "lucide-react";
import { API_BASE_URL, API_ENDPOINTS } from "@/libs/api/config";
import { respondToReview } from "@/libs/api/reviews";
import { checkOwnerSalon } from "@/libs/api/salons";
import Header from "../Header";

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  response?: string;
  created_at: string;
  customer_name: string;
  user_id: number;
}

interface ReviewsProps {
  salonId?: number;
}

const Reviews: React.FC<ReviewsProps> = ({ salonId: propSalonId }) => {
  const [salonId, setSalonId] = useState<number | null>(propSalonId || null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    totalReviews: 0,
    breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [respondingToReviewId, setRespondingToReviewId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalonId = async () => {
      if (!propSalonId) {
        try {
          const result = await checkOwnerSalon();
          if (result.hasSalon && result.salon?.salon_id) {
            setSalonId(result.salon.salon_id);
          }
        } catch (err) {
          console.error("Error fetching salon:", err);
        }
      }
    };
    fetchSalonId();
  }, [propSalonId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!salonId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/reviews/salon/${salonId}`,
          { headers }
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
          setError("Failed to load reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [salonId]);

  const handleSubmitResponse = async (reviewId: number) => {
    if (!responseText.trim() || !salonId) return;

    setSubmittingResponse(true);
    setError("");

    try {
      const result = await respondToReview(reviewId, responseText.trim(), salonId);
      if (result.error) {
        setError(result.error);
      } else {
        setRespondingToReviewId(null);
        setResponseText("");
        // Refresh reviews
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(
          `${API_BASE_URL}/api/reviews/salon/${salonId}`,
          { headers }
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      }
    } catch (err) {
      console.error("Error submitting response:", err);
      setError("Failed to submit response");
    } finally {
      setSubmittingResponse(false);
    }
  };

  if (loading) {
    return (
      <div className="font-inter p-4 sm:p-6 lg:p-8">
        <Header
          title="Reviews"
          subtitle="Manage and respond to customer reviews"
          showActions={false}
        />
        <div className="bg-card border border-border rounded-2xl p-6 mt-6 shadow-soft-br">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!salonId) {
    return (
      <div className="font-inter p-4 sm:p-6 lg:p-8">
        <Header
          title="Reviews"
          subtitle="Manage and respond to customer reviews"
          showActions={false}
        />
        <div className="bg-card border border-border rounded-2xl p-6 mt-6 shadow-soft-br">
          <p className="text-muted-foreground">No salon found. Please create a salon first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter space-y-6 p-4 sm:p-6 lg:p-8">
      <Header
        title="Reviews"
        subtitle="Manage and respond to customer reviews"
        showActions={false}
      />

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {stats.average.toFixed(1)}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(stats.average)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalReviews}</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="mt-6 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-4 h-4 fill-accent text-accent" />
              </div>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${
                      stats.totalReviews > 0
                        ? (stats.breakdown[rating as keyof typeof stats.breakdown] /
                            stats.totalReviews) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.breakdown[rating as keyof typeof stats.breakdown]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-soft-br">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft-br"
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

              <p className="text-foreground mt-3 leading-relaxed">{review.comment}</p>

              {/* Existing Response */}
              {review.response && (
                <div className="mt-4 pl-4 border-l-4 border-primary/20 bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Your Response</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{review.response}</p>
                  {respondingToReviewId !== review.review_id && (
                    <button
                      onClick={() => {
                        setRespondingToReviewId(review.review_id);
                        setResponseText(review.response || "");
                      }}
                      className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Response
                    </button>
                  )}
                </div>
              )}

              {/* Response Form */}
              {respondingToReviewId === review.review_id ? (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={
                      review.response
                        ? "Edit your response..."
                        : "Write a response to this review..."
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-inter"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitResponse(review.review_id)}
                      disabled={!responseText.trim() || submittingResponse}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed text-sm font-inter shadow-soft-br"
                    >
                      {submittingResponse
                      ? "Submitting..."
                      : review.response
                      ? "Update Response"
                      : "Submit Response"}
                    </button>
                    <button
                      onClick={() => {
                        setRespondingToReviewId(null);
                        setResponseText(review.response || "");
                      }}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-smooth text-sm font-inter"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                !review.response && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setRespondingToReviewId(review.review_id);
                        setResponseText("");
                      }}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Respond to this review
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;


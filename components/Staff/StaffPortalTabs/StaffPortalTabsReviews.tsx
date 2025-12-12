"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Send } from "lucide-react";

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  response: string | null;
  created_at: string;
  customer_name: string;
  user_id: number;
}

interface ReviewsData {
  average: number;
  totalReviews: number;
  breakdown: { [key: number]: number };
  reviews: Review[];
}

interface StaffPortalTabsReviewsProps {
  salonId?: number;
}

const StaffPortalTabsReviews: React.FC<StaffPortalTabsReviewsProps> = ({
  salonId,
}) => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const fetchReviews = useCallback(async () => {
    if (!salonId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("staffToken");
      const response = await fetch(`${API_URL}/api/reviews/${salonId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) throw new Error("Failed to fetch reviews");
      
      const data = await response.json();
      setReviewsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [salonId, API_URL]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitResponse = async (reviewId: number) => {
    if (!responseText.trim() || !salonId) return;
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem("staffToken");
      
      const response = await fetch(`${API_URL}/api/reviews/respond/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: responseText.trim(),
          salon_id: salonId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit response");
      }
      
      // Refresh reviews
      await fetchReviews();
      setRespondingTo(null);
      setResponseText("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!reviewsData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reviews data available</p>
      </div>
    );
  }

  const { average, totalReviews, breakdown, reviews } = reviewsData;
  const needsResponse = reviews.filter(r => !r.response).length;

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-3xl font-semibold">{average.toFixed(1)}</p>
            {renderStars(Math.round(average))}
          </div>
        </div>
        
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="mt-2 text-3xl font-semibold">{totalReviews}</p>
        </div>
        
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
          <p className="text-sm text-muted-foreground">Needs Response</p>
          <p className="mt-2 text-3xl font-semibold">{needsResponse}</p>
          {needsResponse > 0 && (
            <p className="text-xs text-amber-600 mt-1">Respond to build trust</p>
          )}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-soft-br">
        <p className="text-sm font-medium text-muted-foreground mb-4">Rating Breakdown</p>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = breakdown[rating] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-12">{rating} star</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">All Reviews</p>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-border bg-white">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => {
            const isResponding = respondingTo === review.review_id;
            
            return (
              <div
                key={review.review_id}
                className="rounded-2xl border border-border bg-white p-5 shadow-soft-br"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{review.customer_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!review.response && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Needs response
                    </span>
                  )}
                </div>
                
                <p className="mt-3 text-sm text-foreground">{review.comment}</p>
                
                {/* Existing Response */}
                {review.response && (
                  <div className="mt-4 pl-4 border-l-2 border-primary/30 bg-primary/5 p-3 rounded-r-lg">
                    <p className="text-xs font-semibold text-primary mb-1">Your Response</p>
                    <p className="text-sm text-foreground">{review.response}</p>
                  </div>
                )}
                
                {/* Response Form */}
                {!review.response && (
                  <div className="mt-4">
                    {isResponding ? (
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write a thoughtful response..."
                          className="w-full p-3 border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmitResponse(review.review_id)}
                            disabled={submitting || !responseText.trim()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-smooth"
                          >
                            <Send className="h-4 w-4" />
                            {submitting ? "Sending..." : "Send Response"}
                          </button>
                          <button
                            onClick={() => {
                              setRespondingTo(null);
                              setResponseText("");
                            }}
                            className="px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted/50 transition-smooth"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRespondingTo(review.review_id)}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Respond to this review
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StaffPortalTabsReviews;


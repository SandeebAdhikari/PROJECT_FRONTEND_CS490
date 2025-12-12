"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, TrendingUp, DollarSign, X } from "lucide-react";
import { getMyLoyaltySummary, type LoyaltySummary, redeemLoyaltyPoints, calculateDiscount } from "@/libs/api/loyalty";

const LoyaltyPointsSummaryComponent = () => {
  const [summary, setSummary] = useState<LoyaltySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<LoyaltySummary | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [calculatedDiscount, setCalculatedDiscount] = useState<number>(0);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    const result = await getMyLoyaltySummary();

    if (result.error) {
      setError(result.error);
    } else if (result.summary) {
      // Ensure summary is always an array
      setSummary(Array.isArray(result.summary) ? result.summary : []);
    } else {
      setSummary([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
    
    // Check if we're returning from payment success page
    const checkPaymentReturn = () => {
      const paymentReturned = sessionStorage.getItem('payment_completed');
      if (paymentReturned === 'true') {
        console.log("[Loyalty] Payment completed flag detected, refreshing points immediately");
        sessionStorage.removeItem('payment_completed');
        fetchSummary();
      }
    };
    
    // Refetch loyalty points every 10 seconds to catch updates after payments/redemptions (reduced from 30s)
    const interval = setInterval(fetchSummary, 10000);
    
    // Refresh when window regains focus or tab becomes visible
    const handleFocus = () => {
      checkPaymentReturn();
      fetchSummary();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkPaymentReturn();
        fetchSummary();
      }
    };
    
    // Check immediately
    checkPaymentReturn();
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-muted rounded-xl"></div>
          <div className="h-20 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(summary) || summary.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Loyalty Points Yet</h3>
        <p className="text-sm text-muted-foreground">
          Start booking appointments to earn loyalty points!
        </p>
      </div>
    );
  }

  const handleOpenRedeemModal = (salon: LoyaltySummary) => {
    setSelectedSalon(salon);
    setShowRedeemModal(true);
    setPointsToRedeem("");
    setCalculatedDiscount(0);
    setRedeemMessage("");
  };

  const handleCalculateDiscount = async () => {
    if (!selectedSalon || !pointsToRedeem) return;
    
    const points = parseInt(pointsToRedeem);
    if (isNaN(points) || points <= 0) return;
    
    const result = await calculateDiscount(selectedSalon.salon_id, points);
    if (result.discount !== undefined) {
      setCalculatedDiscount(result.discount);
    } else if (result.error) {
      setRedeemMessage(result.error);
    }
  };

  const handleRedeemPoints = async () => {
    if (!selectedSalon || !pointsToRedeem) return;
    
    const points = parseInt(pointsToRedeem);
    if (isNaN(points) || points <= 0) {
      setRedeemMessage("Please enter a valid number of points");
      return;
    }
    
    setRedeemLoading(true);
    setRedeemMessage("");
    
    const result = await redeemLoyaltyPoints(selectedSalon.salon_id, points);
    
    if (result.message) {
      setRedeemMessage(result.message);
      setTimeout(() => {
        setShowRedeemModal(false);
        fetchSummary(); // Refresh points
      }, 2000);
    } else if (result.error) {
      setRedeemMessage(result.error);
    }
    
    setRedeemLoading(false);
  };

  // Calculate discount when points change
  useEffect(() => {
    if (pointsToRedeem && selectedSalon) {
      const timeoutId = setTimeout(() => {
        handleCalculateDiscount();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [pointsToRedeem]);

  // Ensure summary is an array
  const summaryArray = Array.isArray(summary) ? summary : [];
  const totalPoints = summaryArray.reduce((sum, salon) => sum + (salon.points || 0), 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft-br">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Loyalty Rewards</h2>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-2xl font-bold">{totalPoints}</span>
          <span className="text-sm text-muted-foreground">total points</span>
        </div>
      </div>

      <div className="space-y-3">
        {summaryArray.map((salon) => (
          <div
            key={salon.salon_id}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">{salon.salon_name}</p>
                  <p className="text-sm opacity-90">Loyalty Member</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-3xl font-bold">{salon.points}</span>
                </div>
                <p className="text-xs opacity-75">points</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenRedeemModal(salon)}
              className="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Redeem for Discount
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-xl">
        <p className="text-sm text-muted-foreground text-center">
          Redeem your points for instant discounts on your next purchase!
        </p>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedSalon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Redeem Points</h3>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <p className="font-semibold">{selectedSalon.salon_name}</p>
              <p className="text-2xl font-bold mt-1">{selectedSalon.points} points available</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Points to Redeem
                </label>
                <input
                  type="number"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(e.target.value)}
                  placeholder="Enter points"
                  min="1"
                  max={selectedSalon.points}
                  className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 100 points required
                </p>
              </div>

              {calculatedDiscount > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Discount Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${calculatedDiscount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    This discount will be applied to your account
                  </p>
                </div>
              )}

              {redeemMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  redeemMessage.includes("success") || redeemMessage.includes("redeemed")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {redeemMessage}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedeemPoints}
                  disabled={redeemLoading || !pointsToRedeem || parseInt(pointsToRedeem) < 100}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {redeemLoading ? "Redeeming..." : "Redeem Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPointsSummaryComponent;


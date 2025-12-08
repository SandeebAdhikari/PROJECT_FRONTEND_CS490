"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, TrendingUp } from "lucide-react";
import { getMyLoyaltySummary, type LoyaltySummary } from "@/libs/api/loyalty";

const LoyaltyPointsSummaryComponent = () => {
  const [summary, setSummary] = useState<LoyaltySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError("");

      const result = await getMyLoyaltySummary();

      if (result.error) {
        setError(result.error);
      } else if (result.summary) {
        setSummary(result.summary);
      }

      setLoading(false);
    };

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

  if (summary.length === 0) {
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

  const totalPoints = summary.reduce((sum, salon) => sum + salon.points, 0);

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
        {summary.map((salon) => (
          <div
            key={salon.salon_id}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white"
          >
            <div className="flex items-center justify-between">
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
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-xl">
        <p className="text-sm text-muted-foreground text-center">
          Redeem your points at checkout for exclusive discounts!
        </p>
      </div>
    </div>
  );
};

export default LoyaltyPointsSummaryComponent;


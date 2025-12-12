"use client";

import React, { useState, useEffect } from "react";
import { Gift, Check, Loader2 } from "lucide-react";
import { getSalonRewards, redeemReward, getMyRewards, Reward, RedeemedReward } from "@/libs/api/rewards";
import { getMyLoyaltySummary, LoyaltySummary } from "@/libs/api/loyalty";

const RewardsSection = () => {
  const [loyaltySummary, setLoyaltySummary] = useState<LoyaltySummary[]>([]);
  const [rewardsBySalon, setRewardsBySalon] = useState<Record<number, Reward[]>>({});
  const [myRewards, setMyRewards] = useState<RedeemedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    
    // Get loyalty summary to know which salons user has points at
    const summaryResult = await getMyLoyaltySummary();
    if (summaryResult.summary) {
      setLoyaltySummary(summaryResult.summary);
      
      // Fetch rewards for each salon
      const rewardsMap: Record<number, Reward[]> = {};
      for (const salon of summaryResult.summary) {
        const rewardsResult = await getSalonRewards(salon.salon_id);
        if (rewardsResult.rewards) {
          rewardsMap[salon.salon_id] = rewardsResult.rewards;
        }
      }
      setRewardsBySalon(rewardsMap);
    }

    // Get user's redeemed rewards
    const myRewardsResult = await getMyRewards();
    if (myRewardsResult.rewards) {
      setMyRewards(myRewardsResult.rewards);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeem = async (salonId: number, rewardId: number) => {
    setRedeeming(rewardId);
    setMessage("");
    
    const result = await redeemReward(salonId, rewardId);
    
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Reward redeemed! Show this to the salon staff.");
      fetchData(); // Refresh data
    }
    
    setRedeeming(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const pendingRewards = myRewards.filter(r => r.status === "pending");

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg ${message.includes("error") || message.includes("Not enough") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      {/* Pending Rewards to Claim */}
      {pendingRewards.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Your Rewards ({pendingRewards.length})
          </h3>
          <div className="space-y-2">
            {pendingRewards.map((reward) => (
              <div key={reward.id} className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <p className="font-semibold">{reward.name}</p>
                <p className="text-sm opacity-90">{reward.salon_name}</p>
                <p className="text-xs opacity-75 mt-1">Show this to staff to claim</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Rewards by Salon */}
      {loyaltySummary.map((salon) => {
        const rewards = rewardsBySalon[salon.salon_id] || [];
        if (rewards.length === 0) return null;

        return (
          <div key={salon.salon_id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{salon.salon_name}</h3>
              <span className="text-sm text-primary font-semibold">{salon.points} pts</span>
            </div>
            
            <div className="space-y-3">
              {rewards.map((reward) => {
                const canRedeem = salon.points >= reward.points_required;
                
                return (
                  <div
                    key={reward.reward_id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      canRedeem ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        canRedeem ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Gift className={`w-5 h-5 ${canRedeem ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-xs text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold">{reward.points_required} pts</p>
                      <button
                        onClick={() => handleRedeem(salon.salon_id, reward.reward_id)}
                        disabled={!canRedeem || redeeming === reward.reward_id}
                        className={`text-xs px-3 py-1 rounded-full mt-1 ${
                          canRedeem
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {redeeming === reward.reward_id ? "..." : canRedeem ? "Redeem" : "Need more pts"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {loyaltySummary.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No rewards available yet.</p>
          <p className="text-sm">Earn points by visiting salons!</p>
        </div>
      )}
    </div>
  );
};

export default RewardsSection;


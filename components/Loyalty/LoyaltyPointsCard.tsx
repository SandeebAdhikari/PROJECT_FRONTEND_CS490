"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles } from "lucide-react";
import { getMyPoints } from "@/libs/api/loyalty";
import type { LoyaltyPointsDetail } from "@/libs/api/loyalty";

interface LoyaltyPointsCardProps {
  salonId: number | string;
  onPointsChange?: (points: LoyaltyPointsDetail) => void;
}

const LoyaltyPointsCard: React.FC<LoyaltyPointsCardProps> = ({
  salonId,
  onPointsChange,
}) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPointsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true);
      setError("");

      const result = await getMyPoints(salonId);

      if (result.error) {
        setError(result.error);
      } else if (result.points) {
        setLoyaltyPoints(result.points);
        onPointsChange?.(result.points);
      }

      setLoading(false);
    };

    if (salonId) {
      fetchPoints();
    }
  }, [salonId, onPointsChange]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white animate-pulse">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6" />
          <div className="h-6 bg-white/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !loyaltyPoints) {
    return null; // Don't show if there's an error or no data
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-90">Loyalty Points</p>
            <h3 className="text-3xl font-bold">{loyaltyPoints.points}</h3>
          </div>
        </div>
        <Sparkles className="w-8 h-8 opacity-50" />
      </div>

      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-75">Can Redeem</p>
            <p className="font-semibold">
              {loyaltyPoints.can_redeem ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="opacity-75">Estimated Value</p>
            <p className="font-semibold">${loyaltyPoints.estimated_discount}</p>
          </div>
        </div>

        {!loyaltyPoints.can_redeem && loyaltyPoints.min_points_redeem > 0 && (
          <p className="text-xs opacity-75 mt-3">
            Minimum {loyaltyPoints.min_points_redeem} points required to redeem
          </p>
        )}
      </div>
    </div>
  );
};

export default LoyaltyPointsCard;

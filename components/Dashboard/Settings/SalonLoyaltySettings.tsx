"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Gift, Plus, Trash2, Tag } from "lucide-react";
import ToggleButton from "../ToggleButton";
import {
  checkOwnerSalon,
  getSalonLoyaltySettings,
  updateSalonLoyaltySettings,
} from "@/libs/api/salons";
import type { LoyaltySettings } from "@/libs/api/salons";
import { getSalonRewards, createReward, deleteReward, Reward } from "@/libs/api/rewards";
import { getSalonPromoCodes, createPromoCode, deletePromoCode, PromoCode } from "@/libs/api/promoCodes";

interface SalonLoyaltySettingsProps {
  suppressMessages?: boolean;
}

const SalonLoyaltySettings = forwardRef<
  { save: () => Promise<void> },
  SalonLoyaltySettingsProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    loyaltyEnabled: false,
    pointsPerVisit: 10,
    pointsPerDollar: 1,
    redeemRate: 100,
    minPointsRedeem: 100,
  });

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newReward, setNewReward] = useState({ name: "", description: "", points_required: 100 });
  const [addingReward, setAddingReward] = useState(false);

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [newPromo, setNewPromo] = useState({ code: "", discount_type: "percent" as "percent" | "fixed", discount_value: 10 });
  const [addingPromo, setAddingPromo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);

          const settingsResult = await getSalonLoyaltySettings(
            result.salon.salon_id
          );
          if (settingsResult.loyaltySettings) {
            // Ensure all fields have default values
            setLoyaltySettings({
              loyaltyEnabled: settingsResult.loyaltySettings.loyaltyEnabled || false,
              pointsPerVisit: settingsResult.loyaltySettings.pointsPerVisit || 10,
              pointsPerDollar: settingsResult.loyaltySettings.pointsPerDollar || 1,
              redeemRate: settingsResult.loyaltySettings.redeemRate || 100,
              minPointsRedeem: settingsResult.loyaltySettings.minPointsRedeem || 100,
            });
          }

          // Fetch rewards
          const rewardsResult = await getSalonRewards(result.salon.salon_id);
          if (rewardsResult.rewards) {
            setRewards(rewardsResult.rewards);
          }

          // Fetch promo codes
          const promoResult = await getSalonPromoCodes(result.salon.salon_id);
          if (promoResult.codes) {
            setPromoCodes(promoResult.codes);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: "error", text: "Failed to load loyalty settings" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!salonId) {
      setMessage({ type: "error", text: "No salon found" });
      throw new Error("No salon found");
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateSalonLoyaltySettings(salonId, loyaltySettings);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({
          type: "success",
          text: result.message || "Loyalty settings updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving loyalty settings:", error);
      setMessage({ type: "error", text: "Failed to save loyalty settings" });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  const handleAddReward = async () => {
    if (!salonId || !newReward.name) return;
    setAddingReward(true);
    const result = await createReward(salonId, newReward.name, newReward.description, newReward.points_required);
    if (result.reward_id) {
      setRewards([...rewards, { ...newReward, reward_id: result.reward_id, salon_id: salonId, is_active: true }]);
      setNewReward({ name: "", description: "", points_required: 100 });
    }
    setAddingReward(false);
  };

  const handleDeleteReward = async (rewardId: number) => {
    if (!salonId) return;
    const result = await deleteReward(rewardId, salonId);
    if (result.success) {
      setRewards(rewards.filter(r => r.reward_id !== rewardId));
    }
  };

  const handleAddPromo = async () => {
    if (!salonId || !newPromo.code) return;
    setAddingPromo(true);
    const result = await createPromoCode(salonId, newPromo.code, newPromo.discount_type, newPromo.discount_value);
    if (result.promo_id) {
      setPromoCodes([...promoCodes, { promo_id: result.promo_id, salon_id: salonId, code: newPromo.code.toUpperCase(), discount_type: newPromo.discount_type === "percent" ? "percentage" : "fixed", discount_value: newPromo.discount_value, usage_limit: 0, used_count: 0, end_date: null, is_active: true }]);
      setNewPromo({ code: "", discount_type: "percent", discount_value: 10 });
    }
    setAddingPromo(false);
  };

  const handleDeletePromo = async (promoId: number) => {
    if (!salonId) return;
    const result = await deletePromoCode(promoId, salonId);
    if (result.success) {
      setPromoCodes(promoCodes.filter(p => p.promo_id !== promoId));
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-muted-foreground">Loading loyalty settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5" />
        <h2 className="text-lg font-bold">Loyalty Program</h2>
      </div>

      {!suppressMessages && message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-secondary text-foreground"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Loyalty Program</p>
            <p className="text-sm text-muted-foreground">
              Allow customers to earn and redeem points
            </p>
          </div>
          <ToggleButton
            checked={loyaltySettings.loyaltyEnabled}
            onChange={(checked) =>
              setLoyaltySettings({
                ...loyaltySettings,
                loyaltyEnabled: checked,
              })
            }
          />
        </div>

        {loyaltySettings.loyaltyEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Points Per Visit
              </label>
              <input
                type="number"
                value={loyaltySettings.pointsPerVisit || 10}
                onChange={(e) =>
                  setLoyaltySettings({
                    ...loyaltySettings,
                    pointsPerVisit: parseInt(e.target.value) || 10,
                  })
                }
                className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                placeholder="Enter points per visit"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Points earned when appointment is completed
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Points Per Dollar Spent
              </label>
              <input
                type="number"
                value={loyaltySettings.pointsPerDollar || 1}
                onChange={(e) =>
                  setLoyaltySettings({
                    ...loyaltySettings,
                    pointsPerDollar: parseFloat(e.target.value) || 1,
                  })
                }
                className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                step="0.01"
                placeholder="Enter points per dollar"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Points earned per dollar spent (e.g., 1 = 1 point per $1)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Redemption Rate (points = $1)
              </label>
              <input
                type="number"
                value={loyaltySettings.redeemRate || 100}
                onChange={(e) =>
                  setLoyaltySettings({
                    ...loyaltySettings,
                    redeemRate: parseFloat(e.target.value) || 100,
                  })
                }
                className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                step="0.01"
                placeholder="Enter redemption rate"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Example: 100 points = $1 discount
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Points to Redeem
              </label>
              <input
                type="number"
                value={loyaltySettings.minPointsRedeem || 100}
                onChange={(e) =>
                  setLoyaltySettings({
                    ...loyaltySettings,
                    minPointsRedeem: parseInt(e.target.value) || 100,
                  })
                }
                className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                placeholder="Enter minimum points to redeem"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum points required before customers can redeem
              </p>
            </div>

            {/* Rewards Management */}
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-medium mb-3">Rewards Catalog</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create rewards customers can redeem with their points
              </p>

              {/* Existing Rewards */}
              {rewards.length > 0 && (
                <div className="space-y-2 mb-4">
                  {rewards.map((reward) => (
                    <div key={reward.reward_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-xs text-muted-foreground">{reward.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary">{reward.points_required} pts</span>
                        <button
                          onClick={() => handleDeleteReward(reward.reward_id)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                          title="Delete reward"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Reward */}
              <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
                <input
                  type="text"
                  placeholder="Reward name (e.g., Free Haircut)"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Points required"
                    value={newReward.points_required}
                    onChange={(e) => setNewReward({ ...newReward, points_required: parseInt(e.target.value) || 100 })}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                  <button
                    onClick={handleAddReward}
                    disabled={!newReward.name || addingReward}
                    className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {addingReward ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* Promo Codes Management */}
            <div className="border-t border-border pt-4 mt-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Promo Codes
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create discount codes for promotions
              </p>

              {promoCodes.length > 0 && (
                <div className="space-y-2 mb-4">
                  {promoCodes.map((promo) => (
                    <div key={promo.promo_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium font-mono">{promo.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {promo.discount_type === "percentage" ? `${promo.discount_value}% off` : `$${promo.discount_value} off`}
                          {promo.used_count > 0 && ` • Used ${promo.used_count}x`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePromo(promo.promo_id)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
                <input
                  type="text"
                  placeholder="Code (e.g., SAVE20)"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newPromo.discount_type}
                    onChange={(e) => setNewPromo({ ...newPromo, discount_type: e.target.value as "percent" | "fixed" })}
                    className="rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="percent">% Off</option>
                    <option value="fixed">$ Off</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Value"
                    value={newPromo.discount_value}
                    onChange={(e) => setNewPromo({ ...newPromo, discount_value: parseFloat(e.target.value) || 10 })}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                  <button
                    onClick={handleAddPromo}
                    disabled={!newPromo.code || addingPromo}
                    className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {addingPromo ? "..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

SalonLoyaltySettings.displayName = "SalonLoyaltySettings";

export default SalonLoyaltySettings;

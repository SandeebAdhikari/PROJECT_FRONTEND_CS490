"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Gift } from "lucide-react";
import ToggleButton from "../ToggleButton";
import { checkOwnerSalon, getSalonLoyaltySettings, updateSalonLoyaltySettings } from "@/libs/api/salons";
import type { LoyaltySettings } from "@/libs/api/salons";

interface SalonLoyaltySettingsProps {
  suppressMessages?: boolean;
}

const SalonLoyaltySettings = forwardRef<
  { save: () => Promise<void> },
  SalonLoyaltySettingsProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    loyaltyEnabled: false,
    pointsPerVisit: 10,
    redeemRate: 100,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
          
          const settingsResult = await getSalonLoyaltySettings(result.salon.salon_id);
          if (settingsResult.loyaltySettings) {
            setLoyaltySettings(settingsResult.loyaltySettings);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: 'error', text: 'Failed to load loyalty settings' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!salonId) {
      setMessage({ type: 'error', text: 'No salon found' });
      throw new Error('No salon found');
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateSalonLoyaltySettings(salonId, loyaltySettings);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({ type: 'success', text: result.message || 'Loyalty settings updated successfully!' });
      }
    } catch (error) {
      console.error("Error saving loyalty settings:", error);
      setMessage({ type: 'error', text: 'Failed to save loyalty settings' });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

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
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-secondary text-foreground' : 'bg-destructive/10 text-destructive'}`}>
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
            onChange={(checked) => setLoyaltySettings({ ...loyaltySettings, loyaltyEnabled: checked })}
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
                value={loyaltySettings.pointsPerVisit}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, pointsPerVisit: parseInt(e.target.value) || 10 })}
                className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Redemption Rate (points = $1)
              </label>
              <input
                type="number"
                value={loyaltySettings.redeemRate}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, redeemRate: parseFloat(e.target.value) || 100 })}
                className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Example: 100 points = $1 discount
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

SalonLoyaltySettings.displayName = "SalonLoyaltySettings";

export default SalonLoyaltySettings;


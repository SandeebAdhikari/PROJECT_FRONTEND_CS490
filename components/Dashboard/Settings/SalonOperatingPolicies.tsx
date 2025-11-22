"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { FileText } from "lucide-react";
import { checkOwnerSalon, getSalonOperatingPolicies, updateSalonOperatingPolicies } from "@/libs/api/salons";
import type { OperatingPolicies } from "@/libs/api/salons";

interface SalonOperatingPoliciesProps {
  suppressMessages?: boolean;
}

const SalonOperatingPolicies = forwardRef<
  { save: () => Promise<void> },
  SalonOperatingPoliciesProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [policies, setPolicies] = useState<OperatingPolicies>({
    refundPolicy: "",
    lateArrivalPolicy: "",
    noShowPolicy: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
          
          const policiesResult = await getSalonOperatingPolicies(result.salon.salon_id);
          if (policiesResult.policies) {
            setPolicies(policiesResult.policies);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: 'error', text: 'Failed to load operating policies' });
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
      const result = await updateSalonOperatingPolicies(salonId, policies);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({ type: 'success', text: result.message || 'Operating policies updated successfully!' });
      }
    } catch (error) {
      console.error("Error saving operating policies:", error);
      setMessage({ type: 'error', text: 'Failed to save operating policies' });
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
        <p className="text-muted-foreground">Loading operating policies...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        <h2 className="text-lg font-bold">Operating Policies</h2>
      </div>

      {!suppressMessages && message && (
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-secondary text-foreground' : 'bg-destructive/10 text-destructive'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Refund Policy
          </label>
          <textarea
            value={policies.refundPolicy}
            onChange={(e) => setPolicies({ ...policies, refundPolicy: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Enter your refund policy (e.g., Full refund if cancelled 24 hours before appointment)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Late Arrival Policy
          </label>
          <textarea
            value={policies.lateArrivalPolicy}
            onChange={(e) => setPolicies({ ...policies, lateArrivalPolicy: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Enter your late arrival policy (e.g., Appointments may be shortened if client arrives more than 15 minutes late)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            No-Show Policy
          </label>
          <textarea
            value={policies.noShowPolicy}
            onChange={(e) => setPolicies({ ...policies, noShowPolicy: e.target.value })}
            className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Enter your no-show policy (e.g., No-shows may be charged 50% of service fee)"
          />
        </div>
      </div>
    </div>
  );
});

SalonOperatingPolicies.displayName = "SalonOperatingPolicies";

export default SalonOperatingPolicies;


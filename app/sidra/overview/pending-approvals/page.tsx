"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Info, RefreshCw } from "lucide-react";
import { getPendingSalons, verifySalon, PendingSalon } from "@/libs/api/admins";

export default function PendingApprovalsPage() {
  const [salons, setSalons] = useState<PendingSalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<PendingSalon | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ action: "approve" | "reject"; salon: PendingSalon } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPendingSalons();
  }, []);

  const loadPendingSalons = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPendingSalons();
      if (result.error) {
        setError(result.error);
      } else {
        setSalons(result.salons || []);
      }
    } catch (err) {
      console.error("Error loading pending salons:", err);
      setError("Failed to load pending salons");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (salon: PendingSalon, action: "approve" | "reject") => {
    setProcessing(true);
    try {
      // Convert action to the format expected by the API: "approve" -> "approved", "reject" -> "rejected"
      const approvalStatus = action === "approve" ? "approved" : "rejected";
      const result = await verifySalon(salon.salon_id, approvalStatus);
      if (result.error) {
        alert(`Failed to ${action} salon: ${result.error}`);
      } else {
        alert(`Salon ${action}d successfully!`);
        // Remove the salon from the list
        setSalons(salons.filter(s => s.salon_id !== salon.salon_id));
        setConfirmAction(null);
      }
    } catch (err) {
      console.error("Error verifying salon:", err);
      alert(`Failed to ${action} salon`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Pending Salon Approvals
          </h1>
          <p className="text-muted-foreground">
            Review and approve salons requesting access to the StyGo platform.
          </p>
        </div>
        <button
          onClick={loadPendingSalons}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {salons.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground text-lg">
            No pending salon approvals at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {salons.map((salon) => (
            <div
              key={salon.salon_id}
              className="
                bg-card 
                border border-border 
                rounded-2xl 
                shadow-sm 
                p-5 
                flex items-center 
                justify-between 
                transition-all
                hover:shadow-md
              "
            >
              {/* LEFT SIDE — Salon Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {salon.name || salon.salon_name || `Salon ${salon.salon_id}`}
                </h2>
                <p className="text-muted-foreground">
                  Owner: {salon.owner_name || "Unknown"}
                </p>
                {salon.owner_email && (
                  <p className="text-muted-foreground text-sm">{salon.owner_email}</p>
                )}
                {salon.address && (
                  <p className="text-subtle-foreground text-sm mt-1">
                    {salon.address}
                    {salon.city && `, ${salon.city}`}
                    {salon.state && `, ${salon.state}`}
                  </p>
                )}
                {salon.phone && (
                  <p className="text-subtle-foreground text-sm">Phone: {salon.phone}</p>
                )}
                <p className="text-subtle-foreground text-xs mt-2">
                  Submitted: {new Date(salon.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* RIGHT SIDE — Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSalon(salon)}
                  className="
                    flex items-center gap-1 px-4 py-2 rounded-lg 
                    bg-muted hover:bg-accent transition-colors
                  "
                >
                  <Info size={16} />
                  Details
                </button>

                <button
                  onClick={() => setConfirmAction({ action: "approve", salon })}
                  disabled={processing}
                  className="
                    flex items-center gap-1 px-4 py-2 rounded-lg 
                    bg-primary text-white 
                    hover:bg-primary/90 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <Check size={16} />
                  Approve
                </button>

                <button
                  onClick={() => setConfirmAction({ action: "reject", salon })}
                  disabled={processing}
                  className="
                    flex items-center gap-1 px-4 py-2 rounded-lg 
                    bg-red-600 text-white 
                    hover:bg-red-700 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedSalon && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {selectedSalon.name || selectedSalon.salon_name || `Salon ${selectedSalon.salon_id}`}
            </h2>

            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Owner:</strong>{" "}
                {selectedSalon.owner_name || "Unknown"}
              </p>
              {selectedSalon.owner_email && (
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  {selectedSalon.owner_email}
                </p>
              )}
              {selectedSalon.phone && (
                <p>
                  <strong className="text-foreground">Phone:</strong>{" "}
                  {selectedSalon.phone}
                </p>
              )}
              {selectedSalon.email && (
                <p>
                  <strong className="text-foreground">Salon Email:</strong>{" "}
                  {selectedSalon.email}
                </p>
              )}
              {selectedSalon.address && (
                <p>
                  <strong className="text-foreground">Address:</strong>{" "}
                  {selectedSalon.address}
                  {selectedSalon.city && `, ${selectedSalon.city}`}
                  {selectedSalon.state && `, ${selectedSalon.state}`}
                </p>
              )}
              {selectedSalon.description && (
                <p className="mt-3">
                  <strong className="text-foreground">Description:</strong>{" "}
                  {selectedSalon.description}
                </p>
              )}
              <p className="mt-3 text-sm">
                <strong className="text-foreground">Status:</strong>{" "}
                <span className="capitalize">{selectedSalon.status}</span>
              </p>
              <p className="text-sm">
                <strong className="text-foreground">Approval:</strong>{" "}
                <span className="capitalize">{selectedSalon.approved}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedSalon(null)}
                className="px-4 py-2 bg-muted hover:bg-secondary transition-colors rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / REJECT MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-foreground capitalize mb-4">
              {confirmAction.action} Salon?
            </h2>

            <p className="text-muted-foreground mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold text-foreground">
                {confirmAction.action}
              </span>{" "}
              the salon <br />
              <span className="font-semibold text-foreground">
                &quot;{confirmAction.salon.name || confirmAction.salon.salon_name || `Salon ${confirmAction.salon.salon_id}`}&quot;?
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={processing}
                className="px-4 py-2 bg-muted hover:bg-secondary transition-colors rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() => handleVerify(confirmAction.salon, confirmAction.action)}
                disabled={processing}
                className={`
                  px-4 py-2 rounded-lg text-white transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    confirmAction.action === "approve"
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-red-600 hover:bg-red-700"
                  }
                `}
              >
                {processing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState } from "react";
import { Check, X, Info } from "lucide-react";
import { pendingSalonApprovals } from "@/libs/sampleData";

export default function PendingApprovalsPage() {
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<any>(null);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        Pending Salon Approvals
      </h1>

      <p className="text-muted-foreground mb-8">
        Review and approve salons requesting access to the StyGo platform.
      </p>

      {/* LIST OF SALONS — LONG TILE CARDS */}
      <div className="space-y-4">
        {pendingSalonApprovals.map((salon) => (
          <div
            key={salon.id}
            className="
              bg-card 
              border border-border 
              rounded-2xl 
              shadow-soft 
              p-5 
              flex items-center 
              justify-between 
              transition-smooth 
              hover:shadow-medium 
              hover:bg-secondary/60
            "
          >
            {/* LEFT SIDE — Salon Info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {salon.name}
              </h2>
              <p className="text-muted-foreground">{salon.owner}</p>
              <p className="text-subtle-foreground text-sm mt-1">
                {salon.submitted}
              </p>
            </div>

            {/* RIGHT SIDE — Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSalon(salon)}
                className="
                  flex items-center gap-1 px-4 py-2 rounded-lg 
                  bg-muted hover:bg-accent-light hover:text-accent-foreground
                  transition-smooth shadow-soft
                "
              >
                <Info size={16} />
                Details
              </button>

              <button
                onClick={() => setConfirmAction({ action: "approve", salon })}
                className="
                  flex items-center gap-1 px-4 py-2 rounded-lg 
                  bg-primary text-primary-foreground 
                  hover:bg-primary-light transition-smooth shadow-soft
                "
              >
                <Check size={16} />
                Approve
              </button>

              <button
                onClick={() => setConfirmAction({ action: "reject", salon })}
                className="
                  flex items-center gap-1 px-4 py-2 rounded-lg 
                  bg-destructive text-destructive-foreground 
                  hover:bg-red-600 transition-smooth shadow-soft
                "
              >
                <X size={16} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selectedSalon && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-[420px] shadow-large">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {selectedSalon.name}
            </h2>

            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Owner:</strong>{" "}
                {selectedSalon.owner}
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                {selectedSalon.email}
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong>{" "}
                {selectedSalon.phone}
              </p>
              <p>
                <strong className="text-foreground">Address:</strong>{" "}
                {selectedSalon.address}
              </p>
              <p className="mt-3">{selectedSalon.description}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedSalon(null)}
                className="px-4 py-2 bg-muted hover:bg-secondary transition-smooth rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / REJECT MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-[350px] shadow-large">
            <h2 className="text-xl font-bold text-foreground capitalize mb-4">
              {confirmAction.action} Salon?
            </h2>

            <p className="text-muted-foreground mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold text-foreground">
                {confirmAction.action}
              </span>{" "}
              the salon <br />"{confirmAction.salon.name}"?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-muted hover:bg-secondary transition-smooth rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => setConfirmAction(null)}
                className={`
                  px-4 py-2 rounded-lg text-white transition-smooth
                  ${
                    confirmAction.action === "approve"
                      ? "bg-primary hover:bg-primary-light"
                      : "bg-destructive hover:bg-red-600"
                  }
                `}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Info, FileText, Mail, Phone, MapPin } from "lucide-react";

type VerificationStatus = "pending" | "approved" | "rejected" | "info-needed";

type SalonVerification = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  city: string;
  submittedAt: string;
  docs: {
    businessLicense: string;
    ownerId: string;
  };
  status: VerificationStatus;
  note?: string;
};

const MOCK_SALONS: SalonVerification[] = [
  {
    id: "SV-1042",
    name: "Glamour Beauty Bar",
    owner: "Sasha Lee",
    email: "sasha@gbeauty.com",
    phone: "555-212-9876",
    city: "Los Angeles, CA",
    submittedAt: "2024-12-01",
    docs: {
      businessLicense: "business-license-1042.pdf",
      ownerId: "owner-id-1042.png",
    },
    status: "pending",
  },
  {
    id: "SV-1058",
    name: "Urban Style Lounge",
    owner: "Marcus Hill",
    email: "marcus@urbanstyle.com",
    phone: "555-410-3344",
    city: "Chicago, IL",
    submittedAt: "2024-12-03",
    docs: {
      businessLicense: "business-license-1058.pdf",
      ownerId: "owner-id-1058.png",
    },
    status: "pending",
  },
  {
    id: "SV-1070",
    name: "Luxe Glow Spa",
    owner: "Priya Patel",
    email: "priya@luxeglow.com",
    phone: "555-744-1099",
    city: "Seattle, WA",
    submittedAt: "2024-12-05",
    docs: {
      businessLicense: "business-license-1070.pdf",
      ownerId: "owner-id-1070.png",
    },
    status: "pending",
  },
];

const statusBadge: Record<VerificationStatus, { label: string; className: string }> = {
  pending: { label: "Pending Review", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  "info-needed": { label: "Needs Info", className: "bg-blue-100 text-blue-800" },
};

export default function VerificationPage() {
  const [salons, setSalons] = useState<SalonVerification[]>(MOCK_SALONS);

  const counts = useMemo(() => {
    return salons.reduce(
      (acc, salon) => {
        acc[salon.status] = (acc[salon.status] || 0) + 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0, "info-needed": 0 } as Record<VerificationStatus, number>
    );
  }, [salons]);

  const updateStatus = (id: string, status: VerificationStatus, note?: string) => {
    setSalons((prev) =>
      prev.map((salon) =>
        salon.id === id
          ? {
              ...salon,
              status,
              note: note ?? salon.note,
            }
          : salon
      )
    );
  };

  const pendingSalons = salons.filter((s) => s.status === "pending");

  return (
    <div className="p-6 sm:p-8 space-y-6 font-inter bg-muted min-h-screen">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-semibold">Admin</p>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold">Salon Verification</h1>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {counts.pending} Pending
          </span>
        </div>
        <p className="text-muted-foreground">
          Review documentation and approve legitimate salons before they go live.
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["pending", "approved", "rejected", "info-needed"] as VerificationStatus[]).map((key) => (
          <div key={key} className="bg-white border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs uppercase text-muted-foreground font-semibold">
              {statusBadge[key].label}
            </p>
            <p className="text-2xl font-bold mt-1">{counts[key]}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Pending submissions</h2>
          <p className="text-sm text-muted-foreground">{pendingSalons.length} to review</p>
        </div>

        <div className="grid gap-4">
          {pendingSalons.map((salon) => (
            <article
              key={salon.id}
              className="bg-white border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Submission #{salon.id}</p>
                  <h3 className="text-lg font-semibold">{salon.name}</h3>
                  <p className="text-sm text-muted-foreground">Owner: {salon.owner}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{salon.city}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[salon.status].className}`}>
                  {statusBadge[salon.status].label}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{salon.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{salon.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>Docs: {salon.docs.businessLicense}, {salon.docs.ownerId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Submitted on {salon.submittedAt}</span>
              </div>

              {salon.note && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-2">
                  Note: {salon.note}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  onClick={() => updateStatus(salon.id, "approved", "Business documents verified.")}
                >
                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 font-semibold hover:bg-red-100 transition-colors"
                  onClick={() => updateStatus(salon.id, "rejected", "Missing proof of address.")}
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold hover:bg-blue-100 transition-colors"
                  onClick={() => updateStatus(salon.id, "info-needed", "Please upload clear license scan.")}
                >
                  Request info
                </button>
              </div>
            </article>
          ))}

          {pendingSalons.length === 0 && (
            <div className="bg-white border border-border rounded-xl p-6 text-center text-muted-foreground">
              All salons are verified. 🎉
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

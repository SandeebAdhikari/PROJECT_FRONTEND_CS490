"use client";

import React, { useEffect, useState } from "react";
import { Users, Star, DollarSign, Plus } from "lucide-react";
import StaffCard, { StaffMember } from "./Staffcard";
import KPI from "@/components/Dashboard/KPI";
import Header from "@/components/Dashboard/Header";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import useSalonId from "@/hooks/useSalonId";

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { salonId, loadingSalon } = useSalonId();

  useEffect(() => {
    if (!salonId) return;

    const loadStaff = async () => {
      setLoading(true);
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/staff/staff/${salonId}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (res.ok) setStaff(data.staff || []);
        else setError(data.error || "Failed to load staff");
      } catch (err) {
        console.error("Staff fetch error:", err);
        setError("Server error loading staff");
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [salonId]);

  if (loadingSalon) {
    return (
      <section className="space-y-6 font-inter">
        <p className="text-muted-foreground">Loading salon information...</p>
      </section>
    );
  }

  const filtered = staff.filter((s: StaffMember) => {
    const t = query.trim().toLowerCase();
    if (!t) return true;
    return (
      s.full_name?.toLowerCase().includes(t) ||
      s.role?.toLowerCase().includes(t) ||
      s.specialization?.toLowerCase().includes(t)
    );
  });

  const total = filtered.length;
  const avgRating = (
    filtered.reduce((a, s) => a + (Number(s.avg_rating) || 0), 0) /
    Math.max(1, total)
  ).toFixed(1);
  const totalRevenue = filtered.reduce(
    (a, s) => a + (Number(s.total_revenue) || 0),
    0
  );

  return (
    <section className="space-y-6 font-inter">
      <Header
        title="Staff Management"
        subtitle="Manage and track all salon appointments"
        onFilterClick={() => console.log("Filter clicked")}
        onPrimaryClick={() => console.log("Open Add Staff modal")}
        primaryLabel="Add Staff Member"
        primaryIcon={Plus}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        <KPI
          label="Total Staff"
          value={total}
          Icon={Users}
          iconClass="bg-blue-100 text-blue-600"
        />
        <KPI
          label="Avg Rating"
          value={avgRating}
          Icon={Star}
          iconClass="bg-yellow-100 text-yellow-600"
        />
        <KPI
          label="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          Icon={DollarSign}
          iconClass="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="flex items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, or specialty…"
          className="w-full max-w-md border border-border rounded-lg px-3 py-2"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading staff...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">
          No staff added yet.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((s: StaffMember) => (
            <StaffCard key={s.staff_id} s={s} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Staff;

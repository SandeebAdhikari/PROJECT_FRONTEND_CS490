"use client";

import React, { useState, useEffect } from "react";
import StaffProfileCard from "@/components/Dashboard/Staff/StaffProfileCard";
import { API_ENDPOINTS } from "@/libs/api/config";

interface Staff {
  staff_id: number;
  full_name: string;
  staff_role: string;
  specialization?: string;
  avg_rating: number;
  review_count: number;
  avatar_url?: string;
}

const SalonStaffSection: React.FC<{ salonId: string }> = ({ salonId }) => {
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.STAFF.GET_SALON_STAFF(salonId)
        );
        if (response.ok) {
          const data = await response.json();
          // Filter only active staff
          const activeStaff = (data.staff || []).filter(
            (s: Staff) => s.staff_id
          );
          setStaffMembers(activeStaff);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchStaff();
    }
  }, [salonId]);

  if (loading) {
    return (
      <div className="mt-10 w-full">
        <p className="text-muted-foreground">Loading staff...</p>
      </div>
    );
  }

  if (staffMembers.length === 0) {
    return (
      <div className="mt-10 w-full">
        <h2 className="text-2xl font-extrabold mb-6">Our Expert Team</h2>
        <p className="text-muted-foreground">
          No staff members available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">Our Expert Team</h2>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full font-inter">
          {staffMembers.length}{" "}
          {staffMembers.length === 1 ? "Specialist" : "Specialists"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((member) => (
          <StaffProfileCard
            key={member.staff_id}
            name={member.full_name}
            role={member.staff_role || "Staff"}
            rating={member.avg_rating || 0}
            reviews={member.review_count || 0}
            specialties={member.specialization ? [member.specialization] : []}
          />
        ))}
      </div>
    </div>
  );
};

export default SalonStaffSection;

"use client";

import React from "react";
import data from "@/data/data.json";
import StaffProfileCard from "@/components/Staff/StaffProfileCard";

interface Staff {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  specialties: string[];
  color?: string;
}

interface DataType {
  staff?: Record<string, Staff[]>;
}

const typedData = data as DataType;

const SalonStaffSection: React.FC<{ salonId: string }> = ({ salonId }) => {
  const staffMembers = typedData.staff?.[salonId] ?? [];

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
          <StaffProfileCard key={member.id} {...member} />
        ))}
      </div>
    </div>
  );
};

export default SalonStaffSection;

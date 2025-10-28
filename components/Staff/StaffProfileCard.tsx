"use client";

import React from "react";
import StaffProfileModal from "@/components/Staff/StaffProfileModal";
import { Star } from "lucide-react";

interface StaffProfileCardProps {
  name: string;
  role: string;
  rating: number;
  reviews: number;
  specialties: string[];
  color?: string;
}

const StaffProfileCard: React.FC<StaffProfileCardProps> = ({
  name,
  role,
  rating,
  reviews,
  specialties,
  color = "bg-green-400",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-muted border border-border rounded-2xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition font-inter">
      <div
        className={`w-20 h-20 ${color} text-primary-foreground flex items-center justify-center text-2xl font-semibold rounded-full mb-4`}
      >
        {initials}
      </div>

      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-neutral-500">{role}</p>

      <div className="flex items-center gap-1 mt-2 text-sm text-neutral-600">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">{rating}</span>
        <span className="text-neutral-400">({reviews} reviews)</span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3 ">
        {specialties.slice(0, 2).map((spec) => (
          <span
            key={spec}
            className="bg-primary-foreground/60 border border-border text-foreground text-xs font-semibold px-2 py-1 rounded-full "
          >
            {spec}
          </span>
        ))}
        {specialties.length > 2 && (
          <span className=" text-neutral-700 text-xs px-3 py-1 rounded-full">
            +{specialties.length - 2}
          </span>
        )}
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-5 w-full bg-primary-foreground border border-border shadow-soft-br text-sm font-medium text-neutral-800 py-1 rounded-lg hover:bg-accent transition-smooth cursor-pointer"
      >
        View Profile
      </button>

      {isOpen && (
        <StaffProfileModal
          staff={{
            name,
            role,
            rating,
            reviews,
            specialties,
            color,
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StaffProfileCard;

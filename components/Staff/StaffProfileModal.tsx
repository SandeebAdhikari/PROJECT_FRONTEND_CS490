"use client";

import React from "react";
import { X, Star, Calendar, BadgeCheck } from "lucide-react";

interface StaffProfileModalProps {
  staff: {
    name: string;
    role: string;
    rating: number;
    reviews: number;
    specialties: string[];
    color?: string;
    about?: string;
  };
  onClose: () => void;
}

const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  staff,
  onClose,
}) => {
  const initials = staff.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-muted rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          title="Close"
          aria-label="Close"
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 ${
              staff.color || "bg-green-400"
            } text-white flex items-center justify-center text-2xl font-semibold rounded-full mb-4`}
          >
            {initials}
          </div>

          <h3 className="text-xl font-bold">{staff.name}</h3>
          <p className="text-sm text-neutral-500">{staff.role}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 text-sm text-neutral-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{staff.rating}</span>
            <span className="text-neutral-400">({staff.reviews} reviews)</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-sm">Specialties</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {staff.specialties.map((s) => (
              <span
                key={s}
                className="bg-neutral-100 text-neutral-700 text-xs px-3 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {staff.about && (
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-1">About</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {staff.about}
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-xl transition">
            <Calendar className="w-4 h-4" />
            Book with {staff.name.split(" ")[0]}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-neutral-300 text-neutral-800 font-medium py-2 rounded-xl hover:bg-neutral-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileModal;

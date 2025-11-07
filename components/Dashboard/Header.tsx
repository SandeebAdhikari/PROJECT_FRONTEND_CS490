"use client";

import React from "react";
import {
  Calendar1,
  Filter,
  Users,
  UserPlus,
  BarChart3,
  Settings,
} from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onFilterClick?: () => void;
  onPrimaryClick?: () => void;
  primaryLabel?: string;
  primaryIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // optional icon for button
  showActions?: boolean; // ✅ new flag to toggle button visibility
}

const Header: React.FC<HeaderProps> = ({
  title = "Appointment Management",
  subtitle = "Manage and track all salon appointments",
  onFilterClick,
  onPrimaryClick,
  primaryLabel = "New Appointment",
  primaryIcon: PrimaryIcon = Calendar1,
  showActions = true, // ✅ by default, buttons will show
}) => {
  return (
    <header className="sm:flex sm:items-start sm:justify-between">
      {/* Title and Subtitle */}
      <div>
        <h2 className="font-inter text-2xl sm:text-3xl font-extrabold">
          {title}
        </h2>
        <p className="text-muted-foreground text-base mt-2 sm:text-lg">
          {subtitle}
        </p>
      </div>

      {/* Buttons section — only render if showActions is true */}
      {showActions && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={onFilterClick}
            className="px-4 py-2.5 rounded-lg border border-border bg-white
              text-sm font-medium text-gray-800
              hover:bg-accent hover:shadow-soft-br
              transition-smooth 
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 
              flex gap-4 justify-center cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button
            onClick={onPrimaryClick}
            className="px-4 py-2.5 rounded-lg border border-transparent
              bg-emerald-600 text-white text-sm font-medium
              hover:bg-emerald-700 hover:shadow-md
              transform hover:-translate-y-[1px]
              transition-smooth 
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 
              flex gap-4 justify-center cursor-pointer"
          >
            <PrimaryIcon className="w-4 h-4" />
            {primaryLabel}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

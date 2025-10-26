"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";

type TabType = "upcoming" | "past" | "favorites";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past Bookings" },
    { id: "favorites", label: "Favorites" },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between gap-1 p-1 bg-muted rounded-lg mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 px-4 py-2 rounded-lg font-inter font-medium text-center transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow border border-border p-8 sm:p-12">
        {activeTab === "upcoming" && <UpcomingContent />}
        {activeTab === "past" && <PastBookingsContent />}
        {activeTab === "favorites" && <FavoritesContent />}
      </div>
    </div>
  );
};

const UpcomingContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
      <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mb-4" />
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        No Upcoming Appointments
      </h3>
      <p className="text-muted-foreground font-inter mb-6 text-center">
        Book your next appointment now!
      </p>
      <button
        onClick={() => alert("Coming soon!")}
        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
      >
        Discover Salons
      </button>
    </div>
  );
};

const PastBookingsContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
      <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mb-4" />
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        No Past Bookings
      </h3>
      <p className="text-muted-foreground font-inter mb-6 text-center">
        Your booking history will appear here.
      </p>
      <button
        onClick={() => alert("Coming soon!")}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
      >
        Discover Salons
      </button>
    </div>
  );
};

const FavoritesContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        No Favorites Yet
      </h3>
      <p className="text-muted-foreground font-inter mb-6 text-center">
        Start saving your favorite salons!
      </p>
      <button
        onClick={() => alert("Coming soon!")}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
      >
        Discover Salons
      </button>
    </div>
  );
};

export default ProfileTabs;

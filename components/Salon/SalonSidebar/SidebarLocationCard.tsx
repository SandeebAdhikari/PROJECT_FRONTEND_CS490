"use client";

import React from "react";
import { MapPin } from "lucide-react";

const SidebarLocationCard = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Location & Hours</h3>
      <div className="h-64 bg-muted rounded-xl flex flex-col items-center justify-center text-muted-foreground font-inter">
        <MapPin className="w-6 h-6 text-primary mb-2" />
        <span className="text-sm font-medium">Click to open in maps</span>
      </div>
    </div>
  );
};

export default SidebarLocationCard;

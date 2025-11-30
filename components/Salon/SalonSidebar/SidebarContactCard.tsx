"use client";

import React from "react";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";

interface SidebarContactCardProps {
  salon?: {
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
}

const SidebarContactCard: React.FC<SidebarContactCardProps> = ({ salon }) => {
  const fullAddress = salon?.address
    ? `${salon.address}${salon.city ? `, ${salon.city}` : ""}`
    : "Address not available";

  const handleOpenMaps = () => {
    if (salon?.address) {
      const query = encodeURIComponent(fullAddress);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  const handleGetDirections = () => {
    if (salon?.address) {
      const query = encodeURIComponent(fullAddress);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, "_blank");
    }
  };

  return (
    <div className="bg-muted border border-border rounded-2xl shadow-sm p-5 font-inter">
      <h3 className="text-lg font-bold mb-4">Contact Information</h3>

      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Address</span>
            <p className="text-muted-foreground">{fullAddress}</p>
          </div>
        </li>

        {salon?.phone && (
          <li className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Phone</span>
              <p className="text-muted-foreground">{salon.phone}</p>
            </div>
          </li>
        )}

        {salon?.email && (
          <li className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Email</span>
              <p className="text-muted-foreground">{salon.email}</p>
            </div>
          </li>
        )}
      </ul>

      {salon?.address && (
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleOpenMaps}
            className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-muted transition"
          >
            <MapPin className="w-4 h-4 inline mr-1 text-green-600" />
            Open in Maps
          </button>
          <button
            onClick={handleGetDirections}
            className="flex-1 bg-green-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-600 transition"
          >
            <Navigation className="w-4 h-4 inline mr-1" />
            Get Directions
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarContactCard;

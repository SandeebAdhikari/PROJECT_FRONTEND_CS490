"use client";

import React from "react";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";

const SidebarContactCard = () => {
  return (
    <div className="bg-muted border border-border rounded-2xl shadow-sm p-5 font-inter">
      <h3 className="text-lg font-bold mb-4">Contact Information</h3>

      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium">Address</span>
            <p className="text-muted-foreground">
              456 Beauty Blvd, Los Angeles
            </p>
          </div>
        </li>

        <li className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium">Phone</span>
            <p className="text-muted-foreground">+1-555-0202</p>
          </div>
        </li>

        <li className="flex items-start gap-2">
          <Mail className="w-4 h-4 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium">Email</span>
            <p className="text-muted-foreground">glamour@salon.com</p>
          </div>
        </li>
      </ul>

      <div className="mt-5 flex gap-3">
        <button className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-muted transition">
          <MapPin className="w-4 h-4 inline mr-1 text-green-600" />
          Open in Maps
        </button>
        <button className="flex-1 bg-green-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-600 transition">
          <Navigation className="w-4 h-4 inline mr-1" />
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default SidebarContactCard;

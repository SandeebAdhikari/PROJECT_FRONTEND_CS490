import { Wifi, Car, CreditCard, Accessibility, Shield } from "lucide-react";
import React from "react";

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Car, label: "Parking Available" },
  { icon: CreditCard, label: "Card Payment" },
  { icon: Accessibility, label: "Wheelchair Accessible" },
];

const SalonDetailInfo = () => {
  return (
    <div className="mt-6 space-y-5">
      <div className=" bg-muted border border-border rounded-lg p-4 ">
        <h1 className="font-bold text-xl">About This Salon</h1>
        <p className="mt-3 font-inter text-muted-foreground text-base">
          Full-service beauty salon offering hair, nails, makeup, and spa
          services.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <p className=" font-inter text-muted-foreground text-sm">
            Licensed & Verified • License #SL-2024-12345
          </p>
        </div>
      </div>
      <div className=" bg-muted border border-border rounded-lg p-4 ">
        <h1 className="font-bold text-xl">Amenities & Features</h1>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 font-inter text-sm">
          {amenities.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-border/30 px-3 py-2"
            >
              <Icon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalonDetailInfo;

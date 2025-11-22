import { Wifi, Car, CreditCard, Accessibility, Shield } from "lucide-react";
import React from "react";

// Icon mapping for amenities
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Free Wi-Fi": Wifi,
  "Parking Available": Car,
  "Card Payment": CreditCard,
  "Wheelchair Accessible": Accessibility,
};

interface SalonDetailInfoProps {
  amenities?: string[];
  description?: string;
}

const SalonDetailInfo: React.FC<SalonDetailInfoProps> = ({ 
  amenities = [], 
  description 
}) => {
  return (
    <div className="mt-6 space-y-5">
      <div className=" bg-muted border border-border rounded-lg p-4 ">
        <h1 className="font-bold text-xl">About This Salon</h1>
        {description ? (
          <p className="mt-3 font-inter text-muted-foreground text-base">
            {description}
          </p>
        ) : (
          <p className="mt-3 font-inter text-muted-foreground text-base italic">
            No description available.
          </p>
        )}
      </div>
      {amenities.length > 0 && (
        <div className=" bg-muted border border-border rounded-lg p-4 ">
          <h1 className="font-bold text-xl">Amenities & Features</h1>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 font-inter text-sm">
            {amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Shield;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-3 rounded-xl bg-border/30 px-3 py-2"
                >
                  <Icon className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-foreground">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetailInfo;

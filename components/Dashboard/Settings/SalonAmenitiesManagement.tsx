"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { X } from "lucide-react";
import { checkOwnerSalon, getSalonAmenities, updateSalonAmenities } from "@/libs/api/salons";

// Common salon amenities that can be selected
const AVAILABLE_AMENITIES = [
  "Free Wi-Fi",
  "Parking Available",
  "Card Payment",
  "Wheelchair Accessible",
  "Air Conditioning",
  "Music",
  "Refreshments",
  "Magazines",
  "Child-Friendly",
  "Pet-Friendly",
  "Private Rooms",
  "Group Bookings",
  "Online Booking",
  "Walk-ins Welcome",
  "Late Hours",
  "Early Hours",
  "Weekend Hours",
  "Gift Cards",
  "Loyalty Program",
  "Student Discount",
  "Senior Discount",
  "Military Discount",
  "Bridal Services",
  "Event Services",
  "Mobile Services",
];

interface SalonAmenitiesManagementProps {
  suppressMessages?: boolean;
}

const SalonAmenitiesManagement = forwardRef<
  { save: () => Promise<void> },
  SalonAmenitiesManagementProps
>(({ suppressMessages = false }, ref) => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadSalonData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
          
          // Fetch amenities
          const amenitiesResult = await getSalonAmenities(result.salon.salon_id);
          if (amenitiesResult.amenities) {
            setSelectedAmenities(amenitiesResult.amenities);
          }
        }
      } catch (error) {
        console.error("Error loading salon data:", error);
        setMessage({ type: "error", text: "Failed to load salon data" });
      } finally {
        setLoading(false);
      }
    };

    loadSalonData();
  }, []);

  // Filter available amenities to exclude already selected
  const availableAmenities = AVAILABLE_AMENITIES.filter(
    (amenity) => !selectedAmenities.includes(amenity)
  );

  const handleAddAmenity = (amenity: string) => {
    if (!selectedAmenities.includes(amenity)) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
  };

  const handleSave = async () => {
    if (!salonId) {
      setMessage({ type: "error", text: "Salon not found" });
      throw new Error("Salon not found");
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateSalonAmenities(salonId, selectedAmenities);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
        throw new Error(result.error);
      } else {
        setMessage({ type: "success", text: result.message || "Amenities updated successfully!" });
      }
    } catch (error) {
      console.error("Error saving amenities:", error);
      setMessage({ type: "error", text: "Failed to save amenities" });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted-foreground">Loading amenities...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold">Amenities & Features</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Select amenities that your salon offers. Customers will see these on your salon page.
      </p>

      {/* Selected Amenities */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Selected Amenities</label>
        {selectedAmenities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No amenities selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {amenity}
                <button
                  onClick={() => handleRemoveAmenity(amenity)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${amenity}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Available Amenities */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Available Amenities</label>
        {availableAmenities.length === 0 ? (
          <p className="text-sm text-muted-foreground">All amenities have been added</p>
        ) : (
          <div className="border border-border rounded-lg bg-card max-h-64 overflow-y-auto">
            {availableAmenities.map((amenity) => (
              <button
                key={amenity}
                onClick={() => handleAddAmenity(amenity)}
                className="w-full text-left px-4 py-2 hover:bg-muted transition-colors border-b border-border last:border-b-0"
              >
                {amenity}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message */}
      {!suppressMessages && message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-secondary text-foreground"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
});

SalonAmenitiesManagement.displayName = "SalonAmenitiesManagement";

export default SalonAmenitiesManagement;


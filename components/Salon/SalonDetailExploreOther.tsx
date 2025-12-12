"use client";

import React, { useEffect, useState } from "react";
import SalonDetailExploreOtherCard from "@/components/Salon/SalonDetailExploreOtherCard";
import { getAllSalons } from "@/libs/api/salons";

interface SalonDetailExploreOtherProps {
  currentSalonId: string;
}

interface Salon {
  salon_id: number;
  name: string;
  city?: string;
  rating?: number;
  totalReviews?: number;
  profile_picture?: string;
  category?: string;
}

const SalonDetailExploreOther: React.FC<SalonDetailExploreOtherProps> = ({
  currentSalonId,
}) => {
  const [relatedSalons, setRelatedSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedSalons = async () => {
      try {
        const result = await getAllSalons();
        const allSalons = (result.salons ?? []) as Salon[];
        
        // Filter out current salon and get up to 3 others
        const otherSalons = allSalons
          .filter((s) => s.salon_id.toString() !== currentSalonId)
          .slice(0, 3);
        
        setRelatedSalons(otherSalons);
      } catch (error) {
        console.error("Error fetching related salons:", error);
        setRelatedSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedSalons();
  }, [currentSalonId]);

  if (loading || relatedSalons.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold mb-6">You May Also Like</h2>

      <div className="sm:flex w-full justify-between">
        {relatedSalons.map((salon) => (
          <SalonDetailExploreOtherCard
            key={salon.salon_id}
            name={salon.name}
            city={salon.city || ""}
            rating={salon.rating || 0}
            totalReviews={salon.totalReviews || 0}
            imageUrl={salon.profile_picture || ""}
            onViewDetails={() =>
              (window.location.href = `/customer/salon-details/${salon.salon_id}`)
            }
          />
        ))}
      </div>
    </section>
  );
};

export default SalonDetailExploreOther;

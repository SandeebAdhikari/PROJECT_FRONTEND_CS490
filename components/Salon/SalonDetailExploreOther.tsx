"use client";

import React from "react";
import data from "@/data/data.json";
import SalonDetailExploreOtherCard from "@/components/Salon/SalonDetailExploreOtherCard";

interface SalonDetailExploreOtherProps {
  currentSalonId: string;
}

const SalonDetailExploreOther: React.FC<SalonDetailExploreOtherProps> = ({
  currentSalonId,
}) => {
  const currentSalon = data.salons.find((s) => s.id === currentSalonId);

  if (!currentSalon) return null;

  const sameCategory = data.salons.filter(
    (s) => s.category === currentSalon.category && s.id !== currentSalon.id
  );

  const fallback = data.salons
    .filter((s) => s.category !== currentSalon.category)
    .slice(0, 3 - sameCategory.length);

  const relatedSalons = [...sameCategory, ...fallback].slice(0, 3);

  if (relatedSalons.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold mb-6">You May Also Like</h2>

      <div className="sm:flex w-full justify-between">
        {relatedSalons.map((salon) => (
          <SalonDetailExploreOtherCard
            key={salon.id}
            name={salon.name}
            city={salon.city}
            rating={salon.rating}
            totalReviews={salon.totalReviews}
            imageUrl={salon.imageUrl ?? ""}
            onViewDetails={() =>
              alert(`Navigate to salon details for ${salon.name}`)
            }
          />
        ))}
      </div>
    </section>
  );
};

export default SalonDetailExploreOther;

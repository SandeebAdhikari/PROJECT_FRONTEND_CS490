"use client";

import React from "react";
import data from "@/data/data.json";
import Image from "next/image";

interface Salon {
  id: string;
  name: string;
  city: string;
  description: string;
  category: string;
  rating: number;
  totalReviews: number;
  priceFrom: number;
  imageUrl?: string;
}

const SalonDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params,
}) => {
  // ✅ Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const salon = data.salons.find(
    (s: Salon) => String(s.id) === String(unwrappedParams.id)
  );

  if (!salon) {
    return <div className="p-6 text-center">Salon not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Image
        src={salon.imageUrl || data.salonImages.default}
        alt={salon.name || "Salon image"}
        width={800}
        height={400}
        className="w-full h-64 object-cover rounded-xl shadow-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{salon.name}</h1>
      <p className="text-muted-foreground mt-2">{salon.city}</p>
      <p className="mt-4">{salon.description}</p>
      <div className="mt-4 text-yellow-500 font-semibold">
        ⭐ {salon.rating} ({salon.totalReviews} reviews)
      </div>
      <p className="mt-2 text-lg font-semibold">From ${salon.priceFrom}</p>
    </div>
  );
};

export default SalonDetailsPage;

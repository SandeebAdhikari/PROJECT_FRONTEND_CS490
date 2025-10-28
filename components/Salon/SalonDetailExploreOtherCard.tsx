"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

interface SalonDetailExploreOtherCardProps {
  name: string;
  city: string;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  onViewDetails?: () => void;
}

const SalonDetailExploreOtherCard: React.FC<
  SalonDetailExploreOtherCardProps
> = ({ name, city, rating, totalReviews, imageUrl, onViewDetails }) => {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition font-inter">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
          width={600}
          height={300}
        />
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {city}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>

          <button
            onClick={onViewDetails}
            className="mt-3 bg-background border border-border rounded-lg px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonDetailExploreOtherCard;

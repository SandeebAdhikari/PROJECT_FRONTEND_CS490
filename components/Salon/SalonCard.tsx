import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Heart } from "lucide-react";
import data from "@/data/data.json";

interface SalonCardProps {
  id: string;
  name: string;
  city: string;
  description: string;
  category: string;
  rating: number;
  totalReviews: number;
  priceFrom: number;
  imageUrl?: string;
  isFavorite?: boolean;
  onViewDetails?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const SalonCard: React.FC<SalonCardProps> = ({
  id,
  name,
  city,
  description,
  category,
  rating,
  totalReviews,
  priceFrom,
  imageUrl,
  isFavorite = false,
  onToggleFavorite,
}) => {
  return (
    <div className="border border-border rounded-2xl overflow-hidden shadow-soft-br hover:shadow-premium transition-smooth bg-card group cursor-pointer relative font-inter">
      <div className="relative">
        <Image
          src={imageUrl || data.salonImages.default}
          alt={name || "Salon image"}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          <span>{category}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          aria-label={
            isFavorite
              ? `Remove ${name} from favorites`
              : `Add ${name} to favorites`
          }
          aria-pressed={isFavorite}
          title={
            isFavorite
              ? `Remove ${name} from favorites`
              : `Add ${name} to favorites`
          }
          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition"
        >
          <Heart
            aria-hidden="true"
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="flex items-center text-sm gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-muted-foreground">({totalReviews})</span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground text-sm gap-1">
          <MapPin className="w-4 h-4" />
          <span>{city}</span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>

        <p className="text-sm text-muted-foreground">From ${priceFrom}</p>

        <Link
          href={`/customer/salon-details/${id}`}
          className="w-full bg-primary-light hover:bg-primary text-white py-2 rounded-lg font-semibold cursor-pointer transition-smooth flex justify-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SalonCard;

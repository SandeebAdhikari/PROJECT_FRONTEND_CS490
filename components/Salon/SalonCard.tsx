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
  const toggleLabel = isFavorite
    ? `Remove ${name} from favorites`
    : `Add ${name} to favorites`;

  return (
    <div className="border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-soft-br hover:shadow-premium transition-smooth bg-card group cursor-pointer relative font-inter h-full flex flex-col">
      <div className="relative">
        <Image
          src={imageUrl || data.salonImages.default}
          alt={name || "Salon image"}
          width={400}
          height={300}
          className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-white text-xs font-semibold px-2.5 py-1 sm:px-3 rounded-full shadow-sm">
          <span>{category}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          aria-label={toggleLabel}
          aria-pressed={isFavorite ? "true" : "false"}
          title={toggleLabel}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Heart
            aria-hidden="true"
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center text-xs sm:text-sm gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-muted-foreground">({totalReviews})</span>
          </div>
        </div>

        <div className="flex items-center text-muted-foreground text-xs sm:text-sm gap-1">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{city}</span>
        </div>

        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 flex-1">
          {description}
        </p>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          From ${priceFrom}
        </p>

        <Link
          href={`/customer/salon-details/${id}`}
          className="w-full bg-primary-light hover:bg-primary text-white py-2 sm:py-2.5 rounded-lg font-semibold cursor-pointer transition-smooth flex justify-center text-sm sm:text-base active:scale-95"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SalonCard;

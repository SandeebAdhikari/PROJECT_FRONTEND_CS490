import React, { useMemo } from "react";
import SalonCard from "../Salon/SalonCard";

interface Salon {
  salon_id?: number;
  id?: string;
  name: string;
  address?: string;
  city?: string;
  description?: string;
  phone?: string;
  status?: string;
  imageUrl?: string;
  profile_picture?: string;
  category?: string;
  rating?: number;
  totalReviews?: number;
  priceFrom?: number;
}

interface CustomerTopSalonProps {
  salons: Salon[];
  selectedService?: string;
  searchQuery?: string;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: (id: string) => boolean;
}

const CustomerTopSalon: React.FC<CustomerTopSalonProps> = ({
  salons = [],
  searchQuery = "",
  onToggleFavorite,
  isFavorite,
}) => {
  const filteredSalons = useMemo(() => {
    let filtered = salons.filter(
      (s) => s.status === "active" || s.status === "pending" || !s.status
    );

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (salon) =>
          salon.name.toLowerCase().includes(query) ||
          (salon.city && salon.city.toLowerCase().includes(query)) ||
          (salon.description &&
            salon.description.toLowerCase().includes(query)) ||
          (salon.address && salon.address.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [salons, searchQuery]);

  if (filteredSalons.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-primary-foreground min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            No salons found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-primary-foreground">
      <div className="max-w-[1600px] mx-auto mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSalons.length}{" "}
          {filteredSalons.length === 1 ? "salon" : "salons"}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-[1600px] mx-auto">
        {filteredSalons.map((salon) => {
          const salonId = salon.salon_id?.toString() || salon.id || "";

          const imageUrl = salon.profile_picture
            ? `http://localhost:4000${salon.profile_picture}`
            : salon.imageUrl ||
              "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop";

          return (
            <SalonCard
              key={salonId}
              id={salonId}
              name={salon.name}
              city={salon.city || "Location TBD"}
              description={salon.description || "A professional salon"}
              category={salon.category || "Beauty Services"}
              rating={salon.rating || 4.5}
              totalReviews={salon.totalReviews || 0}
              priceFrom={salon.priceFrom || 50}
              imageUrl={imageUrl}
              isFavorite={isFavorite?.(salonId) || false}
              onToggleFavorite={onToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CustomerTopSalon;

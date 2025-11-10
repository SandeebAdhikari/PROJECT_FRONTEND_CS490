import React, { useMemo } from "react";
import SalonCard from "../Salon/SalonCard";
import data from "@/data/data.json";

interface CustomerTopSalonProps {
  selectedService?: string;
  searchQuery?: string;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: (id: string) => boolean;
}

const CustomerTopSalon: React.FC<CustomerTopSalonProps> = ({
  selectedService = "all",
  searchQuery = "",
  onToggleFavorite,
  isFavorite,
}) => {
  const filteredSalons = useMemo(() => {
    let filtered = data.salons;

    // Filter by service
    if (selectedService && selectedService !== "all") {
      filtered = filtered.filter((salon) => {
        const category = salon.category.toLowerCase();
        const service = selectedService.toLowerCase();
        
        if (service === "haircut") return category.includes("hair");
        if (service === "coloring") return category.includes("hair");
        if (service === "nails") return category.includes("nail");
        if (service === "eyebrows") return category.includes("brow");
        if (service === "makeup") return category.includes("makeup");
        
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((salon) =>
        salon.name.toLowerCase().includes(query) ||
        salon.city.toLowerCase().includes(query) ||
        salon.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedService, searchQuery]);

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
          Showing {filteredSalons.length} {filteredSalons.length === 1 ? 'salon' : 'salons'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-[1600px] mx-auto">
        {filteredSalons.map((salon) => (
        <SalonCard
          key={salon.id}
          id={salon.id}
          name={salon.name}
          city={salon.city}
          description={salon.description}
          category={salon.category}
          rating={salon.rating}
          totalReviews={salon.totalReviews}
          priceFrom={salon.priceFrom}
          imageUrl={salon.imageUrl}
            isFavorite={isFavorite?.(salon.id) || false}
            onToggleFavorite={onToggleFavorite}
        />
      ))}
      </div>
    </div>
  );
};

export default CustomerTopSalon;

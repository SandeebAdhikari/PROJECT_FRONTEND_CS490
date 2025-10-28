import React from "react";
import SalonCard from "../Salon/SalonCard";
import data from "@/data/data.json";

const CustomerTopSalon = () => {
  const salons = data.salons;

  return (
    <div className="p-4 sm:p-8 bg-primary-foreground grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {salons.map((salon) => (
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
        />
      ))}
    </div>
  );
};

export default CustomerTopSalon;

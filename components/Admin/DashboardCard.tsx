import { DollarSign } from "lucide-react";
import React from "react";

const DashboardCard = () => {
  return (
    <div>
      <div className="mt-4 border border-border bg-secondary rounded-lg p-4">
        <div className="relative w-11 h-11 sm:w-[48px] sm:h-[48px] bg-primary-light rounded-2xl">
          <DollarSign className="absolute text-white flex items-center top-2 left-2.5" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;

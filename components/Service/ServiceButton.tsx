import { Scissors } from "lucide-react";
import React from "react";

interface ServiceButtonProps {
  label: string;
  icon?: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  label,
  icon: Icon = Scissors,
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-3 sm:px-5 rounded-full font-inter text-xs sm:text-sm lg:text-base font-semibold border transition-all duration-300 shadow-soft-br cursor-pointer active:scale-95
        ${
          active
            ? "bg-primary-light text-primary-foreground border-primary-light hover:bg-primary-foreground hover:text-primary-light"
            : "bg-primary-foreground text-foreground border-border hover:border-primary-light hover:bg-primary-light hover:text-white"
        }
      `}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

export default ServiceButton;

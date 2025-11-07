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
      className={`flex items-center gap-2 py-3 px-5 rounded-full font-inter text-sm sm:text-base font-semibold border transition-all duration-300 shadow-soft-br cursor-pointer
        ${
          active
            ? "bg-primary-light text-primary-foreground border-primary-light hover:bg-primary-foreground hover:text-primary-light"
            : "bg-primary-foreground text-foreground border-border hover:border-primary-light hover:bg-primary-light hover:text-white"
        }
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

export default ServiceButton;

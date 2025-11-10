import { Search } from "lucide-react";
import React from "react";

interface CustomerSearchCardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CustomerSearchCard: React.FC<CustomerSearchCardProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mt-6 sm:mt-10 flex justify-center px-4">
      <div className="relative p-4 sm:p-6 lg:p-8 border border-border rounded-xl sm:rounded-2xl flex flex-col sm:flex-row w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-w-4xl justify-center bg-primary-foreground shadow-soft-br gap-3 sm:gap-4">
        <Search className="absolute left-8 sm:left-10 lg:left-12 top-9 sm:top-11 lg:top-14 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />

        <input
          type="text"
          placeholder="Search salons, stylists, or locations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-muted w-full rounded-lg sm:rounded-xl placeholder:text-sm sm:placeholder:text-base placeholder:font-inter focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <button 
          onClick={() => {}}
          className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[120px] px-6 py-2.5 sm:py-3 border border-border rounded-lg sm:rounded-2xl text-sm sm:text-base font-inter font-bold bg-primary-light text-primary-foreground hover:cursor-pointer shadow-soft-br hover:scale-105 transition-smooth active:scale-95"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerSearchCard;

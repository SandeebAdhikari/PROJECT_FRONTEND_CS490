import { Search } from "lucide-react";
import React from "react";

const CustomerSearchCard = () => {
  return (
    <div className="mt-10 flex justify-center">
      <div className="relative p-6 sm:p-8 border border-border rounded-2xl flex flex-col sm:flex w-11/12 sm:w-3/5 justify-center bg-primary-foreground shadow-soft-br gap-4">
        <Search className="absolute left-10 sm:left-12 top-12 sm:top-14 -translate-y-1/2 text-muted-foreground w-5 h-5" />

        <input
          type="text"
          placeholder="Search salons, stylists, or locations..."
          className="pl-12 pr-4 py-3 bg-muted w-full rounded-xl placeholder:text-base placeholder:font-inter focus:outline-none"
        />

        <button className="flex items-center justify-center gap-2 w-full border border-border rounded-xl text-sm sm:text-base font-inter font-bold bg-primary-light text-primary-foreground hover:cursor-pointer shadow-soft-br hover:scale-105 transition-smooth py-3 ">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerSearchCard;

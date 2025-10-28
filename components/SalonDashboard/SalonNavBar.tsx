import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";
import { Bell, Search } from "lucide-react";

const SalonNavBar = () => {
  return (
    <div className="p-4 sm:px-8 flex justify-between items-center w-full border border-b border-border">
      <div className="flex items-center gap-2">
        <NextImage src={Icon9} alt="app-icon" width={40} height={40} />
        <h1 className="font-extrabold text-lg">Stygo</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex  gap-3">
          <select
            aria-label="Select filter"
            title="Select filter"
            className="font-inter text-sm w-[128px] h-[40px] border border-border rounded-lg p-2 outline-none text-shadow-primary-dark"
          >
            <option>Today</option>
            <option>7 Days</option>
            <option>30 Days</option>
            <option>90 Days</option>
          </select>
          <div className="relative">
            <Search className="absolute  w-4 h-4 top-3 left-2 text-primary" />

            <input
              placeholder="Search...."
              className="w-[256px] h-[40px] px-8 border border-border rounded-lg outline-none placeholder:font-inter placeholder:text-sm text-primary"
            />
          </div>
        </div>

        <div className="flex w-10  h-10 rounded-full hover:border hover:border-border items-center justify-center">
          <Bell className="w-5 h-5" />
        </div>

        <div className="rounded-full w-10 h-10 border border-border text-center pt-1">
          SA
        </div>
      </div>
    </div>
  );
};

export default SalonNavBar;

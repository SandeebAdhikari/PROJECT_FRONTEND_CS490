import React from "react";
import Link from "next/link";
interface SalonDetailNavbarProps {
  salonName: string;
}

const SalonDetailNavbar: React.FC<SalonDetailNavbarProps> = ({ salonName }) => {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 font-inter">
      <div className="container px-4 sm:px-8 py-4">
        <nav className="text-sm text-muted-foreground flex gap-1 flex-wrap items-center">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-1">›</span>
          <Link href="/customer" className="hover:text-foreground ">
            Discover
          </Link>
          <span className="mx-1">›</span>
          <span className="text-foreground font-medium truncate">
            {salonName}
          </span>
        </nav>
      </div>
    </div>
  );
};

export default SalonDetailNavbar;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Share2,
  Verified,
} from "lucide-react";
import SalonRatingStar from "./SalonRatingStar";

interface SalonDetailHeroProps {
  salon: {
    id?: string;
    name: string;
    city: string;
    description: string;
    rating: number;
    totalReviews: number;
    priceFrom: number;
    imageUrl?: string;
  };
}

const SalonDetailHero: React.FC<SalonDetailHeroProps> = ({ salon }) => {
  const imageSrc = salon.imageUrl?.includes("unsplash")
    ? `${salon.imageUrl}&w=1200&h=600&fit=crop`
    : salon.imageUrl || "/images/default.jpg";
  return (
    <div className="flex justify-between gap-7">
      <div className="w-full">
        <Link
          href="/customer"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6 font-inter w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to Salons</span>
        </Link>
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={salon.name}
            fill
            quality={95}
            priority
            className="object-cover object-center transition-transform duration-300 transform-gpu group-hover:scale-105"
            sizes="100vw"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {salon.name}
            </h1>
            <div className="flex items-center gap-1 rounded-full  bg-muted/50 px-2 py-[2px] text-[11px] font-semibold text-foreground font-inter">
              <Verified className="w-3 h-3 text-green-600" />
              <span>Verified</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="fab salon"
            title="fab salon"
            className="border border-border p-3 rounded-lg shadow-soft-br cursor-pointer hover:bg-muted transition"
          >
            <span className="sr-only">Save salon</span>
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-1 flex justify-between">
          <div className=" flex font-inter text-sm items-center gap-1">
            <MapPin className=" text-muted-foreground w-4 h-4" />
            <p className="text-muted-foreground">
              456 Beauty Blvd, Los Angeles
            </p>
            <Clock className="w-4 h-4 text-primary-light ml-5" />
            <span className="text-primary-light">Open Now</span>
          </div>
          <button
            type="button"
            aria-label="fab salon"
            title="fab salon"
            className="border border-border p-3 rounded-lg shadow-soft-br cursor-pointer hover:bg-muted transition items-baseline"
          >
            <span className="sr-only">Save salon</span>
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <SalonRatingStar />
        <div className="mt-3 flex">
          <div className="flex items-center gap-1 rounded-full w-fit border border-border px-2 py-[2px] text-[11px] font-semibold text-foreground font-inter">
            <span>Skin Care</span>
          </div>
          <div className="flex items-center gap-1 rounded-full w-fit border border-border px-2 py-[2px] text-[11px] font-semibold text-foreground font-inter">
            <span>Skin Care</span>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/customer/booking-page?salonId=${salon.id || "1"}`}
            className="border border-border py-2 px-4 rounded-xl bg-primary-light font-inter cursor-pointer soft-soft-br font-semibold text-primary-foreground hover:scale-105 transition-smooth"
          >
            Book Appointment Now
          </Link>
          <button className="border border-border py-2 px-4 rounded-xl  font-inter cursor-pointer shadow-soft-br font-semibold hover:bg-accent transition-smooth">
            Message Salon
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonDetailHero;

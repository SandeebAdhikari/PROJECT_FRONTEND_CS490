"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Share2,
  Verified,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SalonRatingStar from "./SalonRatingStar";

interface SalonDetailHeroProps {
  salon: {
    id?: string;
    salon_id?: number;
    name: string;
    city?: string;
    address?: string;
    description?: string;
    rating?: number;
    totalReviews?: number;
    priceFrom?: number;
    imageUrl?: string;
    profile_picture?: string;
  };
}

interface GalleryPhoto {
  photo_id: number;
  photo_url: string;
  caption?: string;
}

const SalonDetailHero: React.FC<SalonDetailHeroProps> = ({ salon }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  
  // Build carousel images
  const carouselImages: string[] = [];
  
  if (salon.profile_picture) {
    carouselImages.push(`http://localhost:4000${salon.profile_picture}`);
  } else if (salon.imageUrl) {
    const imageSrc = salon.imageUrl.includes("unsplash")
      ? `${salon.imageUrl}&w=1200&h=600&fit=crop`
      : salon.imageUrl;
    carouselImages.push(imageSrc);
  }
  
  galleryPhotos.forEach(photo => {
    carouselImages.push(`http://localhost:4000${photo.photo_url}`);
  });
  
  if (carouselImages.length === 0) {
    carouselImages.push("/images/default.jpg");
  }

  // Fetch gallery photos
  useEffect(() => {
    const fetchGallery = async () => {
      const salonId = salon.salon_id || salon.id;
      if (!salonId) {
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:4000/api/photos/salon/${salonId}`);
        if (response.ok) {
          const photos = await response.json();
          setGalleryPhotos(photos);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        // no-op
      }
    };
    
    fetchGallery();
  }, [salon.salon_id, salon.id]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
      }
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carouselImages.length]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

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
        <div 
          className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Images */}
          <div className="relative w-full h-full">
            <Image
              src={carouselImages[currentSlide]}
              alt={`${salon.name} - Photo ${currentSlide + 1}`}
              fill
              quality={95}
              priority={currentSlide === 0}
              className="object-cover object-center transition-all duration-500"
              sizes="100vw"
            />
          </div>

          {/* Navigation Arrows - only show if more than 1 image */}
          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Photo Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentSlide + 1} / {carouselImages.length}
              </div>
            </>
          )}
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
              {salon.address || '456 Beauty Blvd'}{salon.city ? `, ${salon.city}` : ', Los Angeles'}
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
            href={`/customer/booking-page?salonId=${salon.salon_id || salon.id || "1"}`}
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

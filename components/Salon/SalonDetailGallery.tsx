"use client";

import React from "react";
import Image from "next/image";
import data from "@/data/data.json"; // ✅ import default JSON export

interface GalleryImage {
  src: string;
  title?: string;
  subtitle?: string;
}

interface DataType {
  galleries: {
    [key: string]: GalleryImage[];
  };
}

const typedData = data as DataType;

const SalonDetailGallery: React.FC<{ salonId: string }> = ({ salonId }) => {
  const gallery = typedData.galleries[salonId] || [];

  return (
    <div className="mt-5 font-inter">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold">Gallery</h2>
        <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
          {gallery.length} Photos
        </span>
      </div>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-xl group"
            >
              <Image
                src={image.src}
                alt={image.title || `Salon photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-3">
                  <h3 className="text-sm font-semibold">{image.title}</h3>
                  {image.subtitle && (
                    <p className="text-xs text-gray-200">{image.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No gallery images available.
        </p>
      )}
    </div>
  );
};

export default SalonDetailGallery;

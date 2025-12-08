"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { API_ENDPOINTS } from "@/libs/api/config";
import { getImageUrl } from "@/libs/utils/imageUrl";

interface Photo {
  photo_id: number;
  photo_url: string;
  caption?: string;
}

interface SalonDetailGalleryProps {
  salonId: string | number;
}

const SalonDetailGallery: React.FC<SalonDetailGalleryProps> = ({ salonId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PHOTOS.LIST(salonId));
        if (response.ok) {
          const data = await response.json();
          setPhotos(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchGallery();
    }
  }, [salonId]);

  if (loading) {
    return (
      <section className="mt-5 w-full">
        <p className="text-muted-foreground">Loading gallery...</p>
      </section>
    );
  }

  if (photos.length === 0) {
    return null; // Don't show gallery section if no photos
  }

  return (
    <section className="mt-5 w-full">
      <h2 className="text-2xl font-extrabold mb-6">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.photo_id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:opacity-90 transition-opacity"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={getImageUrl(photo.photo_url)}
              alt={photo.caption || "Salon photo"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={getImageUrl(selectedPhoto.photo_url)}
              alt={selectedPhoto.caption || "Salon photo"}
              fill
              className="object-contain"
              sizes="90vw"
            />
            {selectedPhoto.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                <p className="font-inter">{selectedPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SalonDetailGallery;

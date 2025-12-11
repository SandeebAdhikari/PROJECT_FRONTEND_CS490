/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ImageIcon, Calendar } from "lucide-react";
import { getUserPhotos, getPhotoUrl, ServicePhoto } from "@/libs/api/photos";

interface PhotoPair {
  appointment_id: number | null;
  salon_id?: number;
  salon_name?: string;
  scheduled_time?: string;
  before?: ServicePhoto;
  after?: ServicePhoto;
}

const CustomerPhotoGallery = () => {
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPair, setSelectedPair] = useState<PhotoPair | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError("");
    const result = await getUserPhotos();
    
    if (result.photos) {
      setPhotos(result.photos);
    } else if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  // Group photos by salon, then by date (consistent with staff portal)
  // This will be used in the render section below

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your photo gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <p className="font-semibold mb-2">Error loading photos:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          No Photos Yet
        </h3>
        <p className="text-muted-foreground font-inter text-center max-w-md">
          Your before and after photos will appear here after your appointments. 
          Your stylist will add photos to showcase your transformations!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">My Transformations</h2>
        <p className="text-muted-foreground">
          View your before and after photos from all your salon visits
        </p>
      </div>

      <div className="space-y-8">
        {(() => {
          // Group photos by salon, then by date (consistent with staff portal)
          const salonGroups = new Map<string, Map<string, { before: ServicePhoto[]; after: ServicePhoto[] }>>();

          photos.forEach((photo) => {
            const salonId = photo.salon_id || 'unknown';
            const salonName = (photo as any).salon_name || `Salon ${salonId}`;
            
            // Determine date key - use appointment scheduled_time if available, otherwise created_at
            const dateKey = photo.appointment_id && (photo as any).scheduled_time
              ? new Date((photo as any).scheduled_time).toLocaleDateString()
              : new Date(photo.created_at).toLocaleDateString();
            
            // Initialize salon group if needed
            if (!salonGroups.has(salonName)) {
              salonGroups.set(salonName, new Map());
            }
            
            const dateGroups = salonGroups.get(salonName)!;
            
            // Initialize date group if needed
            if (!dateGroups.has(dateKey)) {
              dateGroups.set(dateKey, { before: [], after: [] });
            }
            
            const group = dateGroups.get(dateKey)!;
            if (photo.photo_type === "before") {
              group.before.push(photo);
            } else {
              group.after.push(photo);
            }
          });

          if (salonGroups.size === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  No Photos Yet
                </h3>
                <p className="text-muted-foreground font-inter text-center max-w-md">
                  Your before and after photos will appear here after your appointments. 
                  Your stylist will add photos to showcase your transformations!
                </p>
              </div>
            );
          }

          return Array.from(salonGroups.entries()).map(([salonName, dateGroups]) => {
            // Sort dates descending (most recent first)
            const sortedDates = Array.from(dateGroups.keys()).sort((a, b) => {
              return new Date(b).getTime() - new Date(a).getTime();
            });

            return (
              <div key={salonName}>
                <h3 className="text-lg font-semibold mb-4 text-foreground">{salonName}</h3>
                <div className="space-y-6">
                  {sortedDates.map((dateKey) => {
                    const group = dateGroups.get(dateKey)!;
                    // Create pairs for display (one before + one after per card)
                    const maxPairs = Math.max(group.before.length, group.after.length);
                    
                    return (
                      <div key={dateKey} className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <h4 className="text-sm font-semibold text-foreground">{dateKey}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Array.from({ length: maxPairs }).map((_, index) => {
                            const beforePhoto = group.before[index];
                            const afterPhoto = group.after[index];
                            
                            // Only show card if at least one photo exists
                            if (!beforePhoto && !afterPhoto) return null;
                            
                            return (
                              <div
                                key={index}
                                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => setSelectedPair({
                                  appointment_id: beforePhoto?.appointment_id || afterPhoto?.appointment_id || null,
                                  salon_id: beforePhoto?.salon_id || afterPhoto?.salon_id,
                                  salon_name: salonName,
                                  scheduled_time: dateKey,
                                  before: beforePhoto,
                                  after: afterPhoto,
                                })}
                              >
                                <div className="grid grid-cols-2 gap-1">
                                  {/* Before Photo */}
                                  <div className="relative aspect-square bg-muted">
                                    {beforePhoto ? (
                                      <>
                                        <Image
                                          src={getPhotoUrl(beforePhoto.photo_url)}
                                          alt="Before"
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                                          Before
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>

                                  {/* After Photo */}
                                  <div className="relative aspect-square bg-muted">
                                    {afterPhoto ? (
                                      <>
                                        <Image
                                          src={getPhotoUrl(afterPhoto.photo_url)}
                                          alt="After"
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                                          After
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Lightbox Modal */}
      {selectedPair && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPair(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedPair(null)}
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-6xl">
            <div className="text-white text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">Before & After</h3>
              <p className="text-gray-300">
                {new Date(
                  selectedPair.before?.created_at ||
                    selectedPair.after?.created_at ||
                    ""
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div>
                <div className="text-white text-center mb-2 font-semibold">
                  BEFORE
                </div>
                <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                  {selectedPair.before ? (
                    <Image
                      src={getPhotoUrl(selectedPair.before.photo_url)}
                      alt="Before"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* After Photo */}
              <div>
                <div className="text-white text-center mb-2 font-semibold">
                  AFTER
                </div>
                <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                  {selectedPair.after ? (
                    <Image
                      src={getPhotoUrl(selectedPair.after.photo_url)}
                      alt="After"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPhotoGallery;

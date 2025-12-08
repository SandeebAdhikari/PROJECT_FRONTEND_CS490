"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  X,
} from "lucide-react";
import SalonRatingStar from "./SalonRatingStar";
import { useFavorites } from "@/hooks/useFavorites";

import { API_ENDPOINTS } from "@/libs/api/config";
import { sendMessage } from "@/libs/api/messages";
import { getImageUrl } from "@/libs/utils/imageUrl";

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
    owner_id?: number;
    category?: string;
    status?: string;
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
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [salonOwnerId, setSalonOwnerId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [imageError, setImageError] = useState(false);
  const salonId = salon.salon_id || salon.id;
  const isPending = salon.status === "pending";

  // Use the shared favorites hook for consistency
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteStatus = salonId ? isFavorite(String(salonId)) : false;

  const handleToggleFavorite = () => {
    if (!salonId) return;
    toggleFavorite(String(salonId));
  };

  // Build carousel images - use useMemo to rebuild when galleryPhotos changes
  const carouselImages = useMemo(() => {
    const images: string[] = [];

  // Salon profile picture (use getImageUrl utility)
  if (salon.profile_picture) {
      const profilePicUrl = getImageUrl(salon.profile_picture);
      images.push(profilePicUrl);
  }
  // Fallback image (Unsplash or provided URL)
  else if (salon.imageUrl) {
    const imageSrc = salon.imageUrl.includes("unsplash")
      ? `${salon.imageUrl}&w=1200&h=600&fit=crop`
      : getImageUrl(salon.imageUrl);
      images.push(imageSrc);
  }

    // Gallery photos (backend) - these are fetched in useEffect
  galleryPhotos.forEach((photo) => {
      const galleryUrl = getImageUrl(photo.photo_url);
      images.push(galleryUrl);
  });

    // Fallback if empty - use a placeholder from Unsplash
    if (images.length === 0) {
      images.push("https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=600&fit=crop&auto=format");
    }

    return images;
  }, [salon.profile_picture, salon.imageUrl, galleryPhotos]);

  // Fetch gallery photos
  useEffect(() => {
    const fetchGallery = async () => {
      const salonId = salon.salon_id || salon.id;
      if (!salonId) return;

      try {
        const response = await fetch(API_ENDPOINTS.PHOTOS.LIST(salonId), {
          cache: "no-store",
        });

        if (response.ok) {
          const photos = await response.json();
          setGalleryPhotos(photos);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    const fetchSalonOwner = async () => {
      // Try to get owner_id from salon prop first
      if (salon.owner_id) {
        setSalonOwnerId(salon.owner_id);
        return;
      }

      const salonId = salon.salon_id || salon.id;
      if (!salonId) return;

      try {
        // Try public endpoint (includes owner_id now)
        const response = await fetch(API_ENDPOINTS.SALONS.GET_PUBLIC(salonId), {
          cache: "no-store",
        });

        if (response.ok) {
          const salonData = await response.json();
          if (salonData.owner_id) {
            setSalonOwnerId(salonData.owner_id);
          }
        }
      } catch (error) {
        console.error("Error fetching salon owner:", error);
      }
    };

    const fetchReviews = async () => {
      const salonId = salon.salon_id || salon.id;
      if (!salonId) return;

      try {
        const response = await fetch(
          API_ENDPOINTS.REVIEWS.GET_SALON_REVIEWS(salonId),
          { cache: "no-store" }
        );

        if (response.ok) {
          const data = await response.json();
          setRating(data.average || 0);
          setTotalReviews(data.totalReviews || 0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchGallery();
    fetchSalonOwner();
    fetchReviews();
  }, [salon.salon_id, salon.id, salon.owner_id]);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setImageError(false); // Reset error when changing slides
  }, [carouselImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
    setImageError(false); // Reset error when changing slides
  }, [carouselImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

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
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
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

        {/* HERO CAROUSEL */}
        <div
          className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={imageError || !carouselImages[currentSlide] 
              ? "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=600&fit=crop&auto=format"
              : carouselImages[currentSlide]}
            alt={`${salon.name} - Photo ${currentSlide + 1}`}
            fill
            quality={95}
            priority={currentSlide === 0}
            className="object-cover object-center transition-all duration-500"
            sizes="100vw"
            unoptimized={imageError || carouselImages[currentSlide]?.includes('unsplash.com')}
          />

          {/* Arrows */}
          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next photo"
                title="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
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

        {/* TITLE + ACTIONS */}
        <div className="mt-4 flex justify-between">
          <div className="flex gap-4 items-center flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {salon.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-[2px] text-[11px] font-semibold text-foreground font-inter">
                <Verified className="w-3 h-3 text-green-600" />
                <span>Verified</span>
              </div>
              {salon.status === "pending" && (
                <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-[2px] text-[11px] font-semibold text-yellow-800 font-inter">
                  <span>Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mt-1 flex justify-between">
          <div className="flex font-inter text-sm items-center gap-1">
            <MapPin className="text-muted-foreground w-4 h-4" />
            <p className="text-muted-foreground">
              {salon.address || "Address not available"}
              {salon.city ? `, ${salon.city}` : ""}
            </p>
            <Clock className="w-4 h-4 text-primary-light ml-5" />
          </div>
          <div className="flex gap-2">
            <button
              className={`border border-border p-3 rounded-lg shadow-soft-br hover:bg-muted transition ${
                favoriteStatus ? "bg-red-50 border-red-200" : ""
              }`}
              aria-label={
                favoriteStatus ? "Remove from favorites" : "Add to favorites"
              }
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`w-4 h-4 ${
                  favoriteStatus ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
            <button
              className="border border-border p-3 rounded-lg shadow-soft-br hover:bg-muted transition"
              aria-label="Share salon"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: salon.name,
                      text: `Check out ${salon.name}`,
                      url: window.location.href,
                    })
                    .catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <SalonRatingStar rating={rating} totalReviews={totalReviews} />

        {/* TAGS - Only show if salon has categories/tags */}
        {salon.category && (
          <div className="mt-3 flex">
            <div className="flex items-center gap-1 rounded-full w-fit border border-border px-2 py-[2px] text-[11px] font-semibold font-inter">
              <span>{salon.category}</span>
            </div>
          </div>
        )}

        {/* CTA BUTTONS */}
        <div className="mt-3 flex gap-2">
          {isPending ? (
            <button
              disabled
              className="border border-border py-2 px-4 rounded-xl bg-yellow-100 font-inter font-semibold text-yellow-800 cursor-not-allowed opacity-75"
            >
              Coming Soon
            </button>
          ) : (
            <Link
              href={`/customer/booking-page?salonId=${
                salon.salon_id || salon.id || "1"
              }`}
              className="border border-border py-2 px-4 rounded-xl bg-primary-light font-inter font-semibold text-primary-foreground hover:scale-105 transition"
            >
              Book Appointment Now
            </Link>
          )}
          <button
            onClick={() => {
              const token =
                localStorage.getItem("token") ||
                localStorage.getItem("authToken");
              if (!token) {
                alert("Please login to message the salon");
                window.location.href = "/sign-in";
                return;
              }
              setShowMessageModal(true);
              setMessageError("");
              setMessageSuccess(false);
            }}
            className="border border-border py-2 px-4 rounded-xl font-inter font-semibold shadow-soft-br hover:bg-accent transition"
          >
            Message Salon
          </button>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl shadow-lg max-w-md w-full p-6 font-inter">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">
                Message {salon.name}
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText("");
                  setMessageError("");
                  setMessageSuccess(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  Message sent!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your message has been sent to the salon.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label
                    htmlFor="message-text"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message-text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Ask a question, request information, or share any concerns..."
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-inter"
                  />
                </div>

                {messageError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {messageError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageText("");
                      setMessageError("");
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                    disabled={sending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!messageText.trim()) {
                        setMessageError("Please enter a message");
                        return;
                      }

                      if (!salonId) {
                        setMessageError(
                          "Unable to send message. Please try again."
                        );
                        return;
                      }

                      setSending(true);
                      setMessageError("");

                      try {
                        // Fetch owner_id if not already available
                        let ownerId = salonOwnerId;
                        if (!ownerId) {
                          // Try to get from salon prop first
                          if (salon.owner_id) {
                            ownerId = salon.owner_id;
                            setSalonOwnerId(ownerId);
                          } else {
                            // Fetch from API
                            const response = await fetch(
                              API_ENDPOINTS.SALONS.GET_PUBLIC(salonId),
                              { cache: "no-store" }
                            );
                            if (response.ok) {
                              const salonData = await response.json();
                              ownerId = salonData.owner_id;
                              if (ownerId) {
                                setSalonOwnerId(ownerId);
                              }
                            }
                          }
                        }

                        if (!ownerId) {
                          setMessageError(
                            "Unable to find salon owner. Please try again."
                          );
                          setSending(false);
                          return;
                        }

                        const result = await sendMessage(
                          salonId,
                          ownerId,
                          messageText.trim()
                        );

                        if (result.error) {
                          setMessageError(result.error);
                        } else {
                          setMessageSuccess(true);
                          setMessageText("");
                          setTimeout(() => {
                            setShowMessageModal(false);
                            setMessageSuccess(false);
                          }, 2000);
                        }
                      } catch (error) {
                        console.error("Error sending message:", error);
                        setMessageError(
                          "Failed to send message. Please try again."
                        );
                      } finally {
                        setSending(false);
                      }
                    }}
                    disabled={sending || !messageText.trim()}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetailHero;

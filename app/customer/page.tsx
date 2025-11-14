"use client";

import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/Customer/CustomerNavbar";
import CustomerSearchCard from "@/components/Customer/CustomerSearchCard";
import ServiceButton from "@/components/Dashboard/Service/ServiceButton";
import { useFavorites } from "@/hooks/useFavorites";
import Setup2FAModal from "@/components/Auth/Setup2FAModal";
import { getAllSalons, type Salon as ApiSalon } from "@/libs/api/salons";
import data from "@/data/data.json"; // Import mock data

import { Scissors, Palette, Sparkles, Hand, Eye, Brush } from "lucide-react";
import CustomerTopSalon from "@/components/Customer/CustomerTopSalon";

type CustomerSalon = Omit<ApiSalon, "address" | "phone"> & {
  id?: string;
  city?: string;
  description?: string;
  rating?: number;
  totalReviews?: number;
  priceFrom?: number;
  category?: string;
  imageUrl?: string;
  address?: string;
  phone?: string;
};

const MOCK_SALONS: CustomerSalon[] = Array.isArray(data.salons)
  ? (data.salons as CustomerSalon[])
  : [];

const Page = () => {
  const [selectedService, setSelectedService] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [userPhone, setUserPhone] = useState("");

  const [salons, setSalons] = useState<CustomerSalon[]>([]);
  const [loading, setLoading] = useState(true);

  const services = [
    { id: "all", label: "All Services", icon: Sparkles },
    { id: "haircut", label: "Haircut", icon: Scissors },
    { id: "coloring", label: "Hair Coloring", icon: Palette },
    { id: "nails", label: "Nails", icon: Hand },
    { id: "eyebrows", label: "Eyebrows", icon: Eye },
    { id: "makeup", label: "Makeup", icon: Brush },
  ];

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        // Fetch real salons from backend
        const result = await getAllSalons();
        const realSalons = (result.salons ?? []) as CustomerSalon[];
        
        // Get mock salons from data.json
        const mockSalons = MOCK_SALONS;
        
        // Combine both: real salons first, then mock salons
        const combinedSalons = [...realSalons, ...mockSalons];
        
        setSalons(combinedSalons);
      } catch (error) {
        console.error("Error loading salons:", error);
        // If backend fails, at least show mock data
        setSalons(MOCK_SALONS);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  useEffect(() => {
    const checkFirstLogin = () => {
      const has2FASetup = localStorage.getItem("2fa_setup_completed");
      const hasSkipped2FA = localStorage.getItem("2fa_setup_skipped");
      const isLoggedIn = localStorage.getItem("token");
      const hasSeenPrompt = localStorage.getItem("2fa_first_prompt_shown");

      // Only show on FIRST login if user hasn't set up 2FA or skipped
      if (isLoggedIn && !has2FASetup && !hasSkipped2FA && !hasSeenPrompt) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserPhone(user.phone || "");
        }
        
        setTimeout(() => {
          setShow2FAModal(true);
          localStorage.setItem("2fa_first_prompt_shown", "true");
        }, 2000);
      }
    };

    checkFirstLogin();
  }, []);

  if (loading) {
    return (
      <div className="bg-muted min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading salons...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-muted min-h-screen">
      <CustomerNavbar />
        <CustomerSearchCard 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 px-4 pb-8 sm:pb-16">
        {services.map((service) => (
          <ServiceButton
            key={service.id}
            label={service.label}
            icon={service.icon}
            active={selectedService === service.id}
            onClick={() => setSelectedService(service.id)}
          />
        ))}
      </div>
        <CustomerTopSalon 
          salons={salons}
          selectedService={selectedService}
          searchQuery={searchQuery}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
    </div>

      <Setup2FAModal 
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        userPhone={userPhone}
      />
    </>
  );
};

export default Page;

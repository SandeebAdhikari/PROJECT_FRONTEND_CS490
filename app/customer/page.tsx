"use client";

import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/Customer/CustomerNavbar";
import CustomerSearchCard from "@/components/Customer/CustomerSearchCard";
import ServiceButton from "@/components/Dashboard/Service/ServiceButton";
import { useFavorites } from "@/hooks/useFavorites";
import Setup2FAModal from "@/components/Auth/Setup2FAModal";
import { getAllSalons, type Salon as ApiSalon } from "@/libs/api/salons";

import {
  Scissors,
  Palette,
  Sparkles,
  Hand,
  Eye,
  Brush,
  User,
  Users,
} from "lucide-react";
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

const Page = () => {
  const [selectedService, setSelectedService] = useState("all");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [showBarbershops, setShowBarbershops] = useState(false);
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

  const genderFilters = [
    { id: "men", label: "Men", icon: User },
    { id: "women", label: "Women", icon: Users },
  ];

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        // Fetch salons from backend with filters
        const result = await getAllSalons(selectedService, selectedGender, showBarbershops);
        
        if (result.error) {
          console.error("Error fetching salons:", result.error);
          setSalons([]);
          return;
        }

        const salons = (result.salons ?? []) as CustomerSalon[];
        setSalons(salons);
      } catch (error) {
        console.error("Error loading salons:", error);
        // Show empty array if backend fails
        setSalons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [selectedService, selectedGender, showBarbershops]);

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

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 px-4">
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

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 px-4 pb-8 sm:pb-16">
          {genderFilters.map((filter) => (
            <ServiceButton
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              active={selectedGender === filter.id}
              onClick={() =>
                setSelectedGender(
                  selectedGender === filter.id ? null : filter.id
                )
              }
            />
          ))}
          <ServiceButton
            label="Barbershops"
            icon={Scissors}
            active={showBarbershops}
            onClick={() => setShowBarbershops(!showBarbershops)}
          />
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

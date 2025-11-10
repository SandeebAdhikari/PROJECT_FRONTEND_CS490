"use client";

import { useState, useEffect } from "react";
import CustomerNavbar from "@/components/Customer/CustomerNavbar";
import CustomerSearchCard from "@/components/Customer/CustomerSearchCard";
import ServiceButton from "@/components/Service/ServiceButton";
import { useFavorites } from "@/hooks/useFavorites";
import Setup2FAModal from "@/components/Auth/Setup2FAModal";

import { Scissors, Palette, Sparkles, Hand, Eye, Brush } from "lucide-react";
import CustomerTopSalon from "@/components/Customer/CustomerTopSalon";

const Page = () => {
  const [selectedService, setSelectedService] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [userPhone, setUserPhone] = useState("");

  const services = [
    { id: "all", label: "All Services", icon: Sparkles },
    { id: "haircut", label: "Haircut", icon: Scissors },
    { id: "coloring", label: "Hair Coloring", icon: Palette },
    { id: "nails", label: "Nails", icon: Hand },
    { id: "eyebrows", label: "Eyebrows", icon: Eye },
    { id: "makeup", label: "Makeup", icon: Brush },
  ];

  useEffect(() => {
    const checkFirstLogin = () => {
      const has2FASetup = localStorage.getItem("2fa_setup_completed");
      const hasSkipped2FA = localStorage.getItem("2fa_setup_skipped");
      const isLoggedIn = localStorage.getItem("token");
      const lastPromptDate = localStorage.getItem("2fa_last_prompt");
      const today = new Date().toDateString();

      if (isLoggedIn && !has2FASetup && lastPromptDate !== today) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserPhone(user.phone || "");
        }
        
        setTimeout(() => {
          setShow2FAModal(true);
          localStorage.setItem("2fa_last_prompt", today);
        }, 2000);
      }
    };

    checkFirstLogin();
  }, []);

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

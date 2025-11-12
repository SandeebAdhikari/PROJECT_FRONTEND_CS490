"use client";

import SalonNavBar from "@/components/Dashboard/SalonDashboard/SalonNavBar";
import SalonDashboard from "@/components/Dashboard/SalonDashboard/SalonDashboard";
import SalonDashboardTabs from "@/components/Dashboard/SalonDashboard/SalonDashboardTabs";
import Setup2FAModal from "@/components/Auth/Setup2FAModal";
import { useFirebaseSession } from "@/libs/auth/useFirebaseSession";
import { checkOwnerSalon } from "@/libs/api/salons";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useFirebaseSession();
  const router = useRouter();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [checkingSalon, setCheckingSalon] = useState(true);

  useEffect(() => {
    const checkSalon = async () => {
      const role = localStorage.getItem("role");
      
      if (role === "owner" || role === "salon_owner") {
        const result = await checkOwnerSalon();
        
        // Store salon_id for later use (if they have one)
        if (result.salon?.salon_id) {
          localStorage.setItem("salon_id", result.salon.salon_id.toString());
        }
      }
      
      setCheckingSalon(false);
    };

    checkSalon();
  }, [router]);

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

    if (!checkingSalon) {
      checkFirstLogin();
    }
  }, [checkingSalon]);

  if (checkingSalon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main>
      <SalonNavBar />
      <SalonDashboard />
      <SalonDashboardTabs />
      <div>{children}</div>
      
      <Setup2FAModal 
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        userPhone={userPhone}
      />
    </main>
  );
}

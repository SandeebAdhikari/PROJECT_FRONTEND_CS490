"use client";

import SalonNavBar from "@/components/Dashboard/SalonDashboard/SalonNavBar";
import SalonDashboard from "@/components/Dashboard/SalonDashboard/SalonDashboard";
import SalonDashboardTabs from "@/components/Dashboard/SalonDashboard/SalonDashboardTabs";
import Setup2FAModal from "@/components/Auth/Setup2FAModal";
import { useFirebaseSession } from "@/libs/auth/useFirebaseSession";
import React, { useState, useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useFirebaseSession();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const checkFirstLogin = () => {
      const has2FASetup = localStorage.getItem("2fa_setup_completed");
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

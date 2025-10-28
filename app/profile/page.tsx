"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import ProfileTabs from "@/components/Customer/ProfileTabs";
import { getProfile } from "@/libs/api/auth";

const ProfilePage = () => {
  const [email, setEmail] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserEmail = () => {
      try {
        // First try to get from localStorage (stored during login)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user.email) {
              setEmail(user.email);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.log("Could not parse stored user");
          }
        }
        
        // Fallback: decode JWT if stored user not available
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setEmail(payload.email || "Email not available");
            setLoading(false);
            return;
          } catch (e) {
            console.log("Could not decode token");
          }
        }
        
        setEmail("Email not available");
        setLoading(false);
      } catch (error) {
        console.error("Error loading email:", error);
        setEmail("Error loading email");
        setLoading(false);
      }
    };

    loadUserEmail();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
        <button
          onClick={() => window.location.href = "/customer-view"}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-inter"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Discovery</span>
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/sign-in";
          }}
          className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-semibold transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Profile Header */}
      <div className="p-4 sm:p-8 flex items-center gap-4 sm:gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
            My Profile
          </h1>
          <p className="text-muted-foreground font-inter">{email}</p>
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs />
    </div>
  );
};

export default ProfilePage;

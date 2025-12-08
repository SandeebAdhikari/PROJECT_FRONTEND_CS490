"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";
import { User, ShoppingCart, Gift } from "lucide-react";
import NotificationBell from "@/components/Notifications/NotificationBell";
import { useCart } from "@/hooks/useCart";
import { getMyLoyaltySummary } from "@/libs/api/loyalty";

const CustomerNavbar = () => {
  const cart = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [totalLoyaltyPoints, setTotalLoyaltyPoints] = useState(0);

  useEffect(() => {
    // Calculate total items in cart (services + products with quantities)
    const services = cart.getServices();
    const products = cart.getProducts();
    const totalItems = services.length + products.reduce((sum, p) => sum + p.quantity, 0);
    setCartItemCount(totalItems);
  }, [cart]);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const result = await getMyLoyaltySummary();
        if (!result.error && result.summary) {
          const total = result.summary.reduce((sum, item) => sum + (item.points || 0), 0);
          setTotalLoyaltyPoints(total);
        }
      } catch (err) {
        // Silently fail - don't show error in navbar
        console.error("Failed to fetch loyalty points:", err);
      }
    };

    fetchLoyaltyPoints();
  }, []);

  return (
    <div className="p-3 sm:p-4 lg:px-8 flex justify-between items-center w-full border border-b border-border bg-primary-foreground sticky top-0 z-40">
      <Link href="/customer" className="flex items-center gap-1 sm:gap-2 group">
        <NextImage src={Icon9} alt="app-icon" width={32} height={32} className="sm:w-10 sm:h-10" />
        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">StyGo</span>
      </Link>
      <div className="flex gap-1 sm:gap-2 items-center">
        <NotificationBell />
        
        {/* Loyalty Points Display */}
        {totalLoyaltyPoints > 0 && (
          <Link
            href="/customer/my-profile?tab=loyalty"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
            title="View Loyalty Points"
          >
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{totalLoyaltyPoints}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </Link>
        )}
        
        {/* Cart Icon with Badge */}
        <Link
          href="/customer/cart"
          className="relative p-2 hover:bg-accent rounded-lg transition-bounce"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5 text-foreground" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </Link>

        <div className="relative hidden sm:block">
          <User className="absolute w-4 h-4 top-1/2 left-3 -translate-y-1/2 text-foreground" />
          <Link
            href="/customer/my-profile"
            className="hover:bg-accent transition-bounce rounded-lg py-2 px-4 text-sm lg:text-base font-inter font-semibold text-foreground hover:cursor-pointer hover:shadow-soft-br"
          >
            <span className="ml-6">My Profile</span>
          </Link>
        </div>
        <Link
          href="/customer/my-profile"
          className="sm:hidden p-2 hover:bg-accent rounded-lg transition-bounce"
          aria-label="My Profile"
        >
          <User className="w-5 h-5 text-foreground" />
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('tempToken');
            window.location.href = '/sign-in';
          }}
          className="border border-border rounded-lg py-1.5 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm lg:text-base font-inter font-semibold hover:cursor-pointer hover:bg-accent shadow-soft-br hover:shadow-none transition-smooth"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerNavbar;

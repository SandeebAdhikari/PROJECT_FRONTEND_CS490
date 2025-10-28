"use client";
import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";

const NavBar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background bg-opacity-95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-1 group">
            <NextImage src={Icon9} alt="app-icon" width={45} height={45} />
            <span className="text-2xl font-bold text-foreground">StyGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-inter">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#for-owners"
              className="text-muted-foreground hover:text-foreground hover:transition-colors"
            >
              For Salon Owners
            </Link>
          </div>

          <div className="flex items-center gap-4 font-inter">
            <Link
              href="/sign-in"
              className="px-6 py-2 text-primary  font-semibold transition-colors hover:bg-accent rounded-lg hover:text-foreground"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-soft font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

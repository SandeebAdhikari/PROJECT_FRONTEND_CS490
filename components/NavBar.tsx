"use client";
import React from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background bg-opacity-95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary group-hover:bg-primary-dark transition-colors">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">StyGo</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-inter">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#for-owners"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              For Salon Owners
            </Link>
          </div>

          <div className="flex items-center gap-4 font-inter">
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-soft"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

"use client";
import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";

const navigation = [
  { label: "Platform", href: "#features" },
  { label: "Workflow", href: "#how-it-works" },
  { label: "Enterprise", href: "#for-owners" },
  { label: "Customers", href: "#testimonials" },
];

const NavBar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/95 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="absolute inset-0 rounded-2xl bg-gradient-primary blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <NextImage
                src={Icon9}
                alt="StyGo logo"
                width={48}
                height={48}
                className="relative rounded-xl"
                priority
              />
            </div>
            <div>
              <span className="font-sans text-2xl font-bold text-foreground">StyGo</span>
              <p className="font-inter text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Enterprise Suite
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-inter text-sm">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 font-inter">
            <Link
              href="/sign-in"
              className="px-5 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <button className="hidden md:inline-flex px-5 py-2 text-sm font-semibold rounded-full border border-border/70 text-foreground bg-white shadow-[0_10px_20px_rgba(15,23,42,0.08)] hover:border-primary hover:text-primary transition-colors">
              Request demo
            </button>
            <Link
              href="/sign-up"
              className="px-6 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_20px_40px_rgba(45,212,191,0.35)] hover:-translate-y-0.5 transition-transform"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

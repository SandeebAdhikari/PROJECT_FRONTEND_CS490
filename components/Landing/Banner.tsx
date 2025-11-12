"use client";

import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import heroBackground from "@/public/salons/4.png";
import { Sparkles, Play } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <NextImage
          src={heroBackground}
          alt="Salon panorama"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold tracking-[0.4em]">
              StyGo Horizon
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="font-sans text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance">
              Salon orchestration reimagined for scale.
            </h1>
            <p className="text-lg lg:text-xl text-white/80 font-inter max-w-3xl">
              Replace spreadsheets and point tools with a seamless command
              experience. Horizon keeps stylists, inventory, and guests aligned
              across every city.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-slate-900 font-sans font-semibold text-lg shadow-[0_20px_45px_rgba(15,23,42,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Launch demo
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-sans font-semibold text-lg hover:bg-white/10 transition-colors">
              <Play className="w-5 h-5" />
              Meet the product team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

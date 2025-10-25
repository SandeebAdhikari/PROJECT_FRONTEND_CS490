"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Search, Sparkles } from "lucide-react";

const Banner: React.FC = () => {
  return (
    <section className="bg-background py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 w-fit mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-inter text-primary font-semibold">
                #1 Salon Booking Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight">
              Book Your Perfect
              <span className="text-primary"> Salon Experience</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground font-inter mb-8 max-w-2xl mx-auto lg:mx-0">
              Find and book appointments with the best salons near you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold text-lg transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </Link>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-card text-primary border-2 border-primary rounded-lg hover:bg-primary hover:bg-opacity-10 font-inter font-semibold text-lg transition-colors">
                <Search className="w-5 h-5" />
                Find Salons
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground font-inter">
                  Verified Salons
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">50k+</div>
                <div className="text-sm text-muted-foreground font-inter">
                  Happy Clients
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">4.9★</div>
                <div className="text-sm text-muted-foreground font-inter">
                  Average Rating
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-full h-96 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <div className="text-center text-white">
                <Sparkles className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-inter opacity-75">Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

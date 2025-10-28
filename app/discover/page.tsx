"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, Heart, Filter, Scissors } from "lucide-react";

const DiscoverPage = () => {
  const salons = [
    {
      id: 1,
      name: "Glamour Beauty Bar",
      rating: 4.9,
      reviews: 256,
      location: "Los Angeles",
      description: "Full-service beauty salon offering hair, nails, makeup, and spa",
      price: 45,
      tag: "Skincare",
    },
    {
      id: 2,
      name: "Elite Hair Studio",
      rating: 4.8,
      reviews: 124,
      location: "New York",
      description: "Premium hair salon specializing in modern cuts, coloring, and styling.",
      price: 65,
      tag: "Hair",
    },
    {
      id: 3,
      name: "Urban Style Lounge",
      rating: 4.7,
      reviews: 89,
      location: "Chicago",
      description: "Contemporary salon with creative styling.",
      price: 70,
      tag: "Hair",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-primary">Sty</span><span>Go</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4 font-inter">
          <Link
            href="/customer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">My Profile</span>
          </Link>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 text-center">
          Find Your Perfect Salon
        </h1>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search salons, stylists, or locations..."
              className="w-full border border-border rounded-lg py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground font-inter focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors flex items-center gap-2">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>

        {/* Service Filters */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-inter font-medium transition-colors flex items-center gap-2">
            <span>All Services</span>
          </button>
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-medium transition-colors flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            <span>Haircut</span>
          </button>
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-medium transition-colors flex items-center gap-2">
            <span>Hair Coloring</span>
          </button>
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-medium transition-colors flex items-center gap-2">
            <span>Nails</span>
          </button>
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-medium transition-colors flex items-center gap-2">
            <span>Eyebrows</span>
          </button>
        </div>

        {/* Salons Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Top Salons Near You
            </h2>
            <p className="text-muted-foreground font-inter">
              {salons.length} salons available • Sorted by rating
            </p>
          </div>
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted font-inter font-medium transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Salon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <div key={salon.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-inter font-medium">
                  {salon.tag}
                </span>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{salon.name}</h3>
              
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold text-foreground">{salon.rating}</span>
                <span className="text-muted-foreground font-inter">({salon.reviews})</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground font-inter mb-3">
                <MapPin className="w-4 h-4" />
                <span>{salon.location}</span>
              </div>
              
              <p className="text-muted-foreground font-inter mb-4">{salon.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-foreground font-inter">From ${salon.price}</span>
              </div>
              
              <button 
                onClick={() => alert("View details - coming soon!")}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark font-inter font-semibold transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;


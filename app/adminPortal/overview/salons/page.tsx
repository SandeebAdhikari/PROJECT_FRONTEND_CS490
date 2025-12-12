"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
} from "lucide-react";
import { deleteSalon, getAllSalons, Salon } from "@/libs/api/salons";
import AdminHeader from "@/components/Admin/AdminHeader";

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadSalons();
  }, []);

  const loadSalons = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllSalons();
      if (result.error) {
        setError(result.error);
      } else {
        setSalons(result.salons || []);
      }
    } catch (err) {
      console.error("Error loading salons:", err);
      setError("Failed to load salons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (salonId?: number | null, salonName?: string | null) => {
    if (!salonId) {
      setError("Salon ID is missing");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${salonName || "this salon"}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(salonId);
    try {
      const result = await deleteSalon(salonId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSalons((prev) =>
        prev.filter(
          (salon) =>
            (salon.salon_id ?? (salon.id ? Number(salon.id) : null)) !== salonId
        )
      );
    } catch (err) {
      console.error("Error deleting salon:", err);
      setError("Failed to delete salon");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "blocked":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Blocked
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const filteredSalons = salons.filter((salon) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      salon.name?.toLowerCase().includes(query) ||
      salon.city?.toLowerCase().includes(query) ||
      salon.address?.toLowerCase().includes(query) ||
      salon.email?.toLowerCase().includes(query) ||
      salon.description?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="pb-10">
        <AdminHeader adminName="Admin" />
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading salons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AdminHeader adminName="Admin" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            All Salons
          </h1>
          <p className="text-muted-foreground">
            View and manage all salons on the StyGo platform.
          </p>
        </div>
        <button
          onClick={loadSalons}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search salons by name, city, address, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {filteredSalons.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground text-lg">
            {searchQuery ? "No salons match your search." : "No salons found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredSalons.length} of {salons.length} salons
          </div>
          {filteredSalons.map((salon, index) => {
            const salonId = salon.salon_id ?? (salon.id ? Number(salon.id) : null);
            const cardKey = salonId ?? `salon-${index}`;
            return (
              <div
                key={cardKey}
                className="
                  bg-card 
                  border border-border 
                  rounded-2xl 
                  shadow-sm 
                  p-6 
                  transition-all
                  hover:shadow-md
                "
              >
                <div className="flex items-start justify-between">
                  {/* LEFT SIDE — Salon Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-semibold text-foreground">
                        {salon.name || `Salon ${salon.salon_id}`}
                      </h2>
                      {getStatusBadge(salon.status)}
                    </div>

                  {salon.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {salon.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {salon.address && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {salon.address}
                          {salon.city && `, ${salon.city}`}
                        </span>
                      </div>
                    )}

                    {salon.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{salon.phone}</span>
                      </div>
                    )}

                    {salon.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span>{salon.email}</span>
                      </div>
                    )}

                    {salon.website && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <a
                          href={salon.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {salon.website}
                        </a>
                      </div>
                    )}

                    {salon.created_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Created: {new Date(salon.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(salonId, salon.name)}
                    disabled={deletingId === salonId}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === salonId ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

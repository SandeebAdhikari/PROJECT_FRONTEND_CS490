"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, Calendar, DollarSign, User } from "lucide-react";
import { StaffPortalCustomer } from "@/components/Staff/staffPortalTypes";
import CustomerPhotoManager from "../CustomerPhotoManager";
import { getUserPhotos } from "@/libs/api/photos";

interface StaffPortalTabsCustomerProps {
  customers: StaffPortalCustomer[];
  staffId?: number;
  salonId?: number;
}

interface CustomerPhotoCount {
  [customerId: number]: number;
}

const StaffPortalTabsCustomer: React.FC<StaffPortalTabsCustomerProps> = ({
  customers,
  staffId,
  salonId,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [photoCounts, setPhotoCounts] = useState<CustomerPhotoCount>({});

  // Fetch photo counts for all customers
  const fetchPhotoCounts = useCallback(async () => {
    const counts: CustomerPhotoCount = {};
    for (const customer of customers) {
      try {
        const result = await getUserPhotos(customer.id, salonId);
        if (result.photos) {
          counts[customer.id] = result.photos.length;
        }
      } catch (err) {
        console.error(`Error fetching photos for customer ${customer.id}:`, err);
        counts[customer.id] = 0;
      }
    }
    setPhotoCounts(counts);
  }, [customers, salonId]);

  useEffect(() => {
    if (customers.length > 0) {
      fetchPhotoCounts();
    }
  }, [customers, salonId, fetchPhotoCounts]);

  // Refresh counts when photo manager closes
  const handlePhotoManagerClose = () => {
    setSelectedCustomerId(null);
    fetchPhotoCounts(); // Refresh counts after closing
  };

  if (customers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Celebrate loyal guests and follow up with intention
          </p>
          <h3 className="text-xl font-semibold">Customer loyalty</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <User className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No customers yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Customers will appear here after they book appointments
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Celebrate loyal guests and follow up with intention
          </p>
          <h3 className="text-xl font-semibold">Customer loyalty</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-soft-br hover:shadow-premium transition-smooth bg-card group cursor-pointer relative font-inter h-full flex flex-col"
            >
              {/* Customer Avatar/Header */}
              <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-6 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {customer.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'NA'}
                  </span>
                </div>
                {/* Visit count badge */}
                <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {customer.visits} visits
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-bold line-clamp-1">
                    {customer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {customer.favoriteService || "No favorite service yet"}
                  </p>
                </div>

                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Last visit: </span>
                    <span className="font-semibold text-foreground">
                      {customer.lastVisit && !isNaN(new Date(customer.lastVisit).getTime()) && new Date(customer.lastVisit).getTime() > 0
                        ? new Date(customer.lastVisit).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Lifetime value: </span>
                    <span className="font-semibold text-foreground">
                      ${(Number(customer.lifetimeValue) || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* View Photos Button */}
                <button
                  type="button"
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className="w-full py-2.5 rounded-lg font-semibold cursor-pointer transition-smooth flex justify-center items-center gap-2 text-sm active:scale-95 bg-primary-light hover:bg-primary text-white"
                >
                  <Camera className="h-4 w-4" />
                  View Photos
                  {photoCounts[customer.id] !== undefined && photoCounts[customer.id] > 0 && (
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                      {photoCounts[customer.id]}
                    </span>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedCustomerId && (
        <CustomerPhotoManager
          customerId={selectedCustomerId}
          staffId={staffId}
          salonId={salonId}
          onClose={handlePhotoManagerClose}
        />
      )}
    </>
  );
};

export default StaffPortalTabsCustomer;

"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, PhoneCall, Camera } from "lucide-react";
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
  useEffect(() => {
    const fetchPhotoCounts = async () => {
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
    };

    if (customers.length > 0) {
      fetchPhotoCounts();
    }
  }, [customers, salonId]);

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

        <div className="grid gap-4 md:grid-cols-2">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-soft-br"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.favoriteService}
                  </p>
                </div>
                <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  {customer.visits} visits
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <p>
                  Last visit:{" "}
                  <span className="font-semibold text-foreground">
                    {customer.lastVisit && !isNaN(new Date(customer.lastVisit).getTime()) && new Date(customer.lastVisit).getTime() > 0
                      ? new Date(customer.lastVisit).toLocaleDateString()
                      : "Never"}
                  </span>
                </p>
                <p>
                  Lifetime value:{" "}
                  <span className="font-semibold text-foreground">
                    ${(Number(customer.lifetimeValue) || 0).toLocaleString()}
                  </span>
                </p>
                {customer.phone && (
                  <p>
                    Phone:{" "}
                    <span className="font-semibold text-foreground">
                      {customer.phone}
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary/5 text-primary px-4 py-2 text-xs font-semibold hover:bg-primary/10 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  {photoCounts[customer.id] !== undefined ? (
                    <>
                      View Photos
                      {photoCounts[customer.id] > 0 && (
                        <span className="ml-1 bg-primary text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                          {photoCounts[customer.id]}
                        </span>
                      )}
                    </>
                  ) : (
                    "View Photos"
                  )}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send check-in
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call guest
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
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </>
  );
};

export default StaffPortalTabsCustomer;

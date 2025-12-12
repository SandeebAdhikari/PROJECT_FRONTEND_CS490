"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, User, Users, Star, DollarSign, TrendingUp } from "lucide-react";
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
    fetchPhotoCounts();
  };

  // Calculate stats
  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => (c.visits || 0) >= 3).length;
  const totalRevenue = customers.reduce((sum, c) => sum + (Number(c.lifetimeValue) || 0), 0);
  const avgSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  if (customers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">Track your loyal customers and their details</p>
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
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">Track your loyal customers and their details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">VIP Customers</p>
              <p className="text-2xl font-bold">{vipCustomers}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Spend</p>
              <p className="text-2xl font-bold">${avgSpend.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Customer Directory */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Directory</h3>
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            {customers.map((customer, index) => (
              <div
                key={customer.id}
                className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors ${
                  index !== customers.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground">
                    {customer.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'NA'}
                  </div>
                  
                  {/* Name & Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{customer.name}</p>
                      {(customer.visits || 0) >= 3 && (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{customer.email || "No email"}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone || "No phone"}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-8 text-center">
                  <div>
                    <p className="font-semibold">{customer.visits || 0}</p>
                    <p className="text-xs text-muted-foreground">Visits</p>
                  </div>
                  <div>
                    <p className="font-semibold">${(Number(customer.lifetimeValue) || 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {customer.lastVisit && !isNaN(new Date(customer.lastVisit).getTime()) && new Date(customer.lastVisit).getTime() > 0
                        ? new Date(customer.lastVisit).toLocaleDateString()
                        : "Never"}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Visit</p>
                  </div>
                  <div>
                    <p className="font-semibold">{customer.favoriteService || "-"}</p>
                    <p className="text-xs text-muted-foreground">Favorite Service</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors relative"
                    title="View Photos"
                  >
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    {photoCounts[customer.id] !== undefined && photoCounts[customer.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {photoCounts[customer.id]}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
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

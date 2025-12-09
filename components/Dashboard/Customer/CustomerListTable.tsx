"use client";

import React, { useState } from "react";
import { Edit, Camera } from "lucide-react";
import CustomerPhotoManager from "@/components/Staff/CustomerPhotoManager";
import EditCustomerModal from "./EditCustomerModal";

interface CustomerCardProps {
  userId: number;
  name: string;
  email: string;
  phone?: string | null;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string | null;
  favoriteStaff?: string | null;
  membershipTier?: string;
  salonId?: number;
  staffId?: number;
  customerData?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    notes?: string;
  };
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  userId,
  name = "",
  email = "",
  phone = "",
  totalVisits = 0,
  totalSpent = 0,
  lastVisit = "-",
  favoriteStaff = "-",
  membershipTier = "",
  salonId,
  staffId,
  customerData,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoManager, setShowPhotoManager] = useState(false);
  
  const initials = (name || "U N")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedSpent = `$${Number(totalSpent || 0).toFixed(2)}`;
  const formattedLastVisit = lastVisit
    ? new Date(lastVisit).toLocaleDateString()
    : "—";

  return (
    <div className="border border-border bg-white rounded-xl p-4 sm:p-5 hover:shadow-md transition-smooth flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-[250px]">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base sm:text-lg">{name}</h3>
            {membershipTier === "VIP" && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                VIP
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{email}</p>
          {phone && <p className="text-sm text-gray-500">{phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 text-center lg:flex lg:items-center lg:gap-10 flex-wrap lg:flex-nowrap flex-1">
        <div>
          <p className="text-lg font-semibold">{totalVisits}</p>
          <p className="text-sm text-gray-500">Visits</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{formattedSpent}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{formattedLastVisit}</p>
          <p className="text-sm text-gray-500">Last Visit</p>
        </div>
        <div>
          <p className="text-sm font-semibold">
            {favoriteStaff || "—"}
          </p>
          <p className="text-sm text-gray-500">Favorite Staff</p>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-center lg:justify-end text-gray-600">
        <button
          title="Edit Customer"
          onClick={() => setShowEditModal(true)}
          className="p-2 rounded-md hover:bg-gray-100 transition-smooth"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          title="Before & After Photos"
          onClick={() => setShowPhotoManager(true)}
          className="p-2 rounded-md hover:bg-gray-100 transition-smooth"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {showEditModal && (
        <EditCustomerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userId={userId}
          salonId={salonId}
          initialData={{
            full_name: name,
            email,
            phone: phone || "",
            address: customerData?.address || "",
            city: customerData?.city || "",
            state: customerData?.state || "",
            zip: customerData?.zip || "",
            notes: customerData?.notes || "",
          }}
          onUpdated={() => {
            setShowEditModal(false);
            // Reload the page or refresh data
            window.location.reload();
          }}
        />
      )}

      {showPhotoManager && salonId && (
        <CustomerPhotoManager
          customerId={userId}
          staffId={staffId}
          salonId={salonId}
          onClose={() => setShowPhotoManager(false)}
        />
      )}
    </div>
  );
};

export default CustomerCard;

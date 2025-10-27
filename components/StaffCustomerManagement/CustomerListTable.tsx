"use client";

import React from "react";
import { Eye, Edit, Phone, Mail, SlidersHorizontal, UserPlus } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipTier: string;
  totalSpent: number;
  totalAppointments: number;
  loyaltyPoints: number;
  joinDate: string;
  lastVisit: string;
  nextAppointment: string | null;
  favoriteService: string;
  averageRating: number;
  status: string;
  profileImage: string;
}

interface CustomerListTableProps {
  customers: Customer[];
}

const CustomerListTable: React.FC<CustomerListTableProps> = ({ customers }) => {
  const filteredCustomers = customers;

  const getMembershipBadge = (tier: string) => {
    if (tier === "Platinum" || tier === "Gold") {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
          VIP
        </span>
      );
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
          ACTIVE
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Customer Management</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and track your salon customers
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-smooth">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Directory Title and Search removed - integrated into header */}

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="p-4 sm:p-6">
          <h3 className="text-base font-semibold mb-4">Customer Directory</h3>
          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-smooth"
              >
                {/* Left: Customer Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0 mb-3 sm:mb-0">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                    {customer.profileImage}
                  </div>

                  {/* Name and Contact */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-1">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {customer.name}
                      </h4>
                      {getMembershipBadge(customer.membershipTier)}
                      {getStatusBadge(customer.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {customer.email}
                    </p>
                    <p className="text-xs text-gray-400">{customer.phone}</p>
                  </div>
                </div>

                {/* Center: Stats */}
                <div className="flex gap-6 sm:gap-8 flex-wrap sm:flex-nowrap mb-3 sm:mb-0 w-full sm:w-auto">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">
                      {customer.totalAppointments}
                    </p>
                    <p className="text-xs text-gray-500">Visits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">
                      ${customer.totalSpent}
                    </p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{customer.lastVisit}</p>
                    <p className="text-xs text-gray-500">Last Visit</p>
                  </div>
                  <div className="text-center hidden lg:block">
                    <p className="text-sm font-semibold">
                      {customer.favoriteService.split(" ")[0]}
                    </p>
                    <p className="text-xs text-gray-500">Favorite Staff</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 ml-auto sm:ml-4">
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-smooth"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-smooth"
                    title="Edit Customer"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-smooth"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded-lg transition-smooth"
                    title="Email Customer"
                  >
                    <Mail className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerListTable;

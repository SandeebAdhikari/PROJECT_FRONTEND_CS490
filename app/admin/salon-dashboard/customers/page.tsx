"use client";

import React from "react";
import CustomerStatsCards from "@/components/Dashboard/Customer/CustomerStatsCards";
import CustomerCard from "@/components/Dashboard/Customer/CustomerListTable";
import data from "@/data/staff-customer-management.json" assert { type: "json" };
import Header from "@/components/Dashboard/Header";
import { UserPlus } from "lucide-react";
const CustomersPage = () => {
  const customers = data.customers || [];

  return (
    <div className="space-y-6 font-inter p-6 sm:p-8">
      <Header
        title="Customer Management"
        subtitle="Track your loyal customers and their details"
        primaryLabel="Add Customer"
        primaryIcon={UserPlus}
        showActions={true}
      />

      <CustomerStatsCards stats={data.customerStats} />

      <section>
        <h2 className="text-xl font-semibold mb-4">Customer Directory</h2>
        <div className="space-y-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              name={customer.name}
              email={customer.email}
              phone={customer.phone}
              totalVisits={customer.totalAppointments}
              totalSpent={customer.totalSpent}
              lastVisit={customer.lastVisit}
              favoriteStaff={customer.favoriteService?.split(" ")[0] || "N/A"}
              membershipTier={
                customer.membershipTier === "Gold" ||
                customer.membershipTier === "Platinum"
                  ? "VIP"
                  : ""
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomersPage;

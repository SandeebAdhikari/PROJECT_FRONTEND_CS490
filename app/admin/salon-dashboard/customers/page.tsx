import React from "react";
import CustomerStatsCards from "@/components/StaffCustomerManagement/CustomerStatsCards";
import CustomerListTable from "@/components/StaffCustomerManagement/CustomerListTable";
import data from "@/data/staff-customer-management.json" assert { type: "json" };

const CustomersPage = () => {
  return (
    <div className="space-y-6 font-inter p-6 sm:p-8">
      {/* Stats Cards */}
      <CustomerStatsCards stats={data.customerStats} />

      {/* Customer List */}
      <CustomerListTable customers={data.customers} />
    </div>
  );
};

export default CustomersPage;

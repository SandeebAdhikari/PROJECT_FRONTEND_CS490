import React from "react";
import CustomerStatsCards from "@/components/StaffCustomerManagement/CustomerStatsCards";
import CustomerListTable from "@/components/StaffCustomerManagement/CustomerListTable";
import data from "@/data/staff-customer-management.json" assert { type: "json" };

const CustomersPage = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <CustomerStatsCards stats={data.customerStats} />

      {/* Customer List */}
      <CustomerListTable customers={data.customers} />
    </div>
  );
};

export default CustomersPage;

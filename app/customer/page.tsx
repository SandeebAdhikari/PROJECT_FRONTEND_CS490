import CustomerNavbar from "@/components/Customer/CustomerNavbar";
import CustomerSearchCard from "@/components/Customer/CustomerSearchCard";
import React from "react";

const page = () => {
  return (
    <div className="bg-muted min-h-screen">
      <CustomerNavbar />
      <CustomerSearchCard />
    </div>
  );
};

export default page;

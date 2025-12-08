"use client";

import React from "react";
import { StaffPortalCustomer } from "@/components/Staff/staffPortalTypes";

interface StaffPortalTabsCustomerProps {
  customers: StaffPortalCustomer[];
}

const StaffPortalTabsCustomer: React.FC<StaffPortalTabsCustomerProps> = ({
  customers,
}) => {
  return (
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
                  {new Date(customer.lastVisit).toLocaleDateString()}
                </span>
              </p>
              <p>
                Lifetime value:{" "}
                <span className="font-semibold text-foreground">
                  ${customer.lifetimeValue.toLocaleString()}
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

          </article>
        ))}
      </div>
    </div>
  );
};

export default StaffPortalTabsCustomer;

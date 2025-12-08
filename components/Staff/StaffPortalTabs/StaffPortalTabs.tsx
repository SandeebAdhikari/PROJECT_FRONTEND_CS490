"use client";

import React from "react";
import {
  StaffPortalAppointment,
  StaffPortalCustomer,
  StaffPortalProduct,
} from "@/components/Staff/staffPortalTypes";
import StaffPortalTabsOverview from "./StaffPortalTabsOverview";
import StaffPortalTabsCustomer from "./StaffPortalTabsCustomer";
import StaffPortalTabsProduct from "./StaffPortalTabsProduct";
import StaffPortalTabsAppointment from "./StaffPortalTabsAppointment";
import StaffPortalTabsAvailability from "./StaffPortalTabsAvailability";
import StaffPortalTabsSchedule from "./StaffPortalTabsSchedule";

type TabKey = "overview" | "appointments" | "schedule" | "customers" | "products" | "availability";

const tabConfig: { id: TabKey; label: string; description: string }[] = [
  { id: "overview", label: "Overview", description: "Shift briefing" },
  {
    id: "appointments",
    label: "Appointments",
    description: "Guests & prep notes",
  },
  { id: "schedule", label: "Schedule", description: "Today&apos;s schedule" },
  { id: "customers", label: "Customers", description: "Relationships" },
  { id: "products", label: "Retail", description: "Attach & inventory" },
  { id: "availability", label: "Availability", description: "Set your hours" },
];

interface StaffPortalTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  appointments: StaffPortalAppointment[];
  customers: StaffPortalCustomer[];
  products: StaffPortalProduct[];
  featuredStaff: never[];
  nextAppointment?: StaffPortalAppointment;
  onCreateAppointment: () => void;
  onEditAppointment: (appointmentId: number) => void;
  onAddStaff: () => void;
  onEditStaff: (staff: never) => void;
  onUpdateAppointmentStatus?: (appointmentId: number, status: string) => Promise<void>;
}

const StaffPortalTabs: React.FC<StaffPortalTabsProps> = ({
  activeTab,
  onTabChange,
  appointments,
  customers,
  products,
  featuredStaff,
  nextAppointment,
  onCreateAppointment,
  onEditAppointment,
  onAddStaff,
  onEditStaff,
  onUpdateAppointmentStatus,
}) => {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-soft-br">
      <div className="flex flex-wrap gap-3">
        {tabConfig.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition-smooth ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className="text-xs text-muted-foreground">
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {activeTab === "overview" && (
          <StaffPortalTabsOverview
            appointments={appointments}
            nextAppointment={nextAppointment}
            customers={customers}
            teamMembers={featuredStaff}
            onCreateAppointment={onCreateAppointment}
            onAddStaff={onAddStaff}
            onEditStaff={onEditStaff}
          />
        )}

        {activeTab === "appointments" && (
          <StaffPortalTabsAppointment
            appointments={appointments}
            onCreateAppointment={onCreateAppointment}
            onEditAppointment={onEditAppointment}
            onUpdateStatus={onUpdateAppointmentStatus}
          />
        )}

        {activeTab === "schedule" && <StaffPortalTabsSchedule />}

        {activeTab === "customers" && (
          <StaffPortalTabsCustomer customers={customers} />
        )}

        {activeTab === "products" && (
          <StaffPortalTabsProduct products={products} />
        )}

        {activeTab === "availability" && (
          <StaffPortalTabsAvailability />
        )}
      </div>
    </section>
  );
};

export default StaffPortalTabs;

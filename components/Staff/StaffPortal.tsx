"use client";

import React, { useEffect, useMemo, useState } from "react";
import StaffPortalNavbar from "./StaffPortalNavbar";
import StaffPortalAnalytics from "./StaffPortalAnalytics";
import StaffPortalTabs from "./StaffPortalTabs/StaffPortalTabs";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";
import AppointmentEditModal from "@/components/Dashboard/Appointments/AppointmentEditModal";
import AddStaffModal from "@/components/Dashboard/Staff/AddStaffModal";
import EditStaffModal from "@/components/Dashboard/Staff/EditStaffModal";
import useSalonId from "@/hooks/useSalonId";
import { StaffMember } from "@/components/Dashboard/Staff/Staffcard";
import {
  StaffPortalAppointment,
  StaffPortalCustomer,
  StaffPortalProduct,
} from "./staffPortalTypes";

const isoForDay = (dayOffset: number, hour: number, minute: number) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const demoAppointments: StaffPortalAppointment[] = [
  {
    id: 4312,
    client: "Hazel Spencer",
    service: "Balayage gloss",
    status: "confirmed",
    time: isoForDay(0, 9, 30),
    duration: 90,
    price: 210,
    notes: "Prefers warmer tone + chamomile tea",
  },
  {
    id: 4313,
    client: "Leo Watkins",
    service: "Signature fade",
    status: "checked-in",
    time: isoForDay(0, 11, 0),
    duration: 45,
    price: 68,
    notes: "Use matte pomade finish",
  },
  {
    id: 4314,
    client: "Marina Ellis",
    service: "Hydration facial",
    status: "completed",
    time: isoForDay(-1, 15, 15),
    duration: 60,
    price: 145,
    notes: "Allergic to lavender",
  },
  {
    id: 4315,
    client: "Tessa Monroe",
    service: "Copper refresh",
    status: "confirmed",
    time: isoForDay(1, 10, 0),
    duration: 105,
    price: 265,
    notes: "Upsell gloss top coat",
  },
];

const demoCustomers: StaffPortalCustomer[] = [
  {
    id: 91,
    name: "Hazel Spencer",
    favoriteService: "Balayage gloss",
    visits: 18,
    lastVisit: isoForDay(-32, 12, 0),
    lifetimeValue: 12340,
    phone: "(555) 412‑9182",
    notes: "Prefers early appointments",
  },
  {
    id: 92,
    name: "Leo Watkins",
    favoriteService: "Signature fade",
    visits: 7,
    lastVisit: isoForDay(-56, 14, 0),
    lifetimeValue: 860,
    phone: "(555) 410‑7729",
  },
  {
    id: 93,
    name: "Marina Ellis",
    favoriteService: "Hydration facial",
    visits: 11,
    lastVisit: isoForDay(-12, 16, 30),
    lifetimeValue: 2240,
    phone: "(555) 482‑6110",
    notes: "Sensitive skin protocol",
  },
  {
    id: 94,
    name: "Tessa Monroe",
    favoriteService: "Copper refresh",
    visits: 3,
    lastVisit: isoForDay(-84, 9, 45),
    lifetimeValue: 690,
    phone: "(555) 501‑1250",
  },
];

const demoProducts: StaffPortalProduct[] = [
  {
    id: 2001,
    name: "Luna Repair Oil",
    brand: "StyGo Labs",
    retailPrice: 42,
    stock: 14,
    attachRate: 36,
    hero: true,
  },
  {
    id: 2002,
    name: "Velvet Curl Crème",
    brand: "North Shore",
    retailPrice: 28,
    stock: 26,
    attachRate: 29,
  },
  {
    id: 2003,
    name: "Copper Care Kit",
    brand: "Aurora",
    retailPrice: 58,
    stock: 9,
    attachRate: 18,
  },
  {
    id: 2004,
    name: "Daily SPF Veil",
    brand: "Lyra Skin",
    retailPrice: 34,
    stock: 33,
    attachRate: 41,
  },
];

type TabKey = "overview" | "appointments" | "customers" | "products";

interface StaffProfile {
  fullName: string;
  role: string;
  salonName: string;
  salonSlug?: string;
  salonId?: number;
  email?: string;
  phone?: string;
  shiftWindow: string;
  focus: string;
}

const StaffPortal = () => {
  const { salonId, salonSlug: ownerSalonSlug, salonName: ownerSalonName } =
    useSalonId();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [staffProfile, setStaffProfile] = useState<StaffProfile>({
    fullName: "Guest Stylist",
    role: "Color Specialist",
    salonName: "StyGo Salon",
    shiftWindow: "9:00 AM – 5:00 PM",
    focus: "Attach a treatment to 3 color guests",
  });

  const [appointments] = useState<StaffPortalAppointment[]>(demoAppointments);
  const [customers] = useState<StaffPortalCustomer[]>(demoCustomers);
  const [products] = useState<StaffPortalProduct[]>(demoProducts);

  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    number | null
  >(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored =
      window.localStorage.getItem("staffUser") ||
      window.localStorage.getItem("user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setStaffProfile((prev) => ({
        ...prev,
        fullName: parsed.full_name || parsed.name || prev.fullName,
        role: parsed.staff_role || parsed.role || prev.role,
        salonName:
          parsed.salon_name || parsed.businessName || prev.salonName,
        salonSlug: parsed.salon_slug || prev.salonSlug,
        salonId: parsed.salon_id || prev.salonId,
        email: parsed.email || prev.email,
        phone: parsed.phone || prev.phone,
      }));
    } catch (error) {
      console.warn("Unable to hydrate staff profile:", error);
    }
  }, []);

  const derivedSalonName =
    staffProfile.salonName || ownerSalonName || "Your Salon";

  const derivedSalonSlug = useMemo(() => {
    const rawSlug =
      staffProfile.salonSlug ||
      ownerSalonSlug ||
      derivedSalonName.toLowerCase();
    return rawSlug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }, [derivedSalonName, ownerSalonSlug, staffProfile.salonSlug]);

  const effectiveSalonId = salonId || staffProfile.salonId || 0;

  const todaysAppointments = useMemo(() => {
    const today = new Date();
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.time);
      return (
        apptDate.getFullYear() === today.getFullYear() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getDate() === today.getDate()
      );
    });
  }, [appointments]);

  const completedAppointments = appointments.filter(
    (appt) => appt.status === "completed"
  ).length;
  const checkedInAppointments = appointments.filter(
    (appt) => appt.status === "checked-in"
  ).length;

  const nextAppointment = useMemo(() => {
    const upcoming = [...appointments].filter(
      (appt) => new Date(appt.time) >= new Date()
    );
    return upcoming.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    )[0];
  }, [appointments]);

  const newClientsThisMonth = customers.filter((c) => c.visits <= 3).length;

  const analyticsStats = useMemo(
    () => [
      {
        label: "Guests today",
        value: todaysAppointments.length.toString(),
        change: "+2 vs last Thursday",
        positive: true,
      },
      {
        label: "Checked-in",
        value: checkedInAppointments.toString(),
        change: "Keep under 10 min wait",
        positive: true,
      },
      {
        label: "Completed",
        value: completedAppointments.toString(),
        change: "3 left to close",
        positive: false,
      },
      {
        label: "New clients",
        value: newClientsThisMonth.toString(),
        change: "Greet + track referrals",
        positive: true,
      },
    ],
    [
      checkedInAppointments,
      completedAppointments,
      newClientsThisMonth,
      todaysAppointments.length,
    ]
  );

  const analyticsInsights = [
    {
      title: "Retail attach rate",
      description: "Offer Luna Repair Oil after every color glaze.",
      metric: "32%",
      progress: 32,
    },
    {
      title: "Rebooking focus",
      description: "Ask Hazel + Marina to pre-book before checkout.",
      metric: "74%",
      progress: 74,
    },
    {
      title: "Service add-ons",
      description: "Recommend scalp detox during lightener rinses.",
      metric: "2 / 3",
      progress: 66,
    },
  ];

  const featuredStaff = useMemo<StaffMember[]>(() => {
    const primary: StaffMember = {
      staff_id: staffProfile.salonId || 1,
      salon_id: salonId || staffProfile.salonId || 1,
      user_id: staffProfile.salonId || 1,
      staff_role: staffProfile.role,
      specialization: "Color correction, Signature gloss",
      is_active: true,
      full_name: staffProfile.fullName,
      email: staffProfile.email,
      phone: staffProfile.phone,
      avg_rating: 4.9,
      review_count: 58,
      total_revenue: 14200,
      efficiency_percentage: 94,
    };

    const support: StaffMember[] = [
      {
        staff_id: 7821,
        salon_id: salonId || staffProfile.salonId || 1,
        user_id: 7821,
        staff_role: "Assistant",
        specialization: "Blowouts, scalp prep",
        is_active: true,
        full_name: "River Mae",
        email: "river@stygo.com",
        phone: "(555) 400‑8122",
        avg_rating: 4.7,
        review_count: 31,
        total_revenue: 4800,
        efficiency_percentage: 88,
      },
      {
        staff_id: 7822,
        salon_id: salonId || staffProfile.salonId || 1,
        user_id: 7822,
        staff_role: "Front desk",
        specialization: "Guest relations",
        is_active: true,
        full_name: "Jamie Cole",
        email: "jamie@stygo.com",
        phone: "(555) 490‑1124",
        avg_rating: 4.8,
        review_count: 24,
        total_revenue: 0,
        efficiency_percentage: 91,
      },
    ];

    return [primary, ...support];
  }, [salonId, staffProfile]);

  const heroStats = [
    {
      label: "Guests today",
      value: todaysAppointments.length.toString(),
    },
    {
      label: "Retail goal",
      value: "$1.1k",
    },
    {
      label: "New clients",
      value: newClientsThisMonth.toString(),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-muted/30 py-8 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-2">
          <StaffPortalNavbar
            staffName={staffProfile.fullName}
            staffRole={staffProfile.role}
            salonName={derivedSalonName}
            shiftWindow={staffProfile.shiftWindow}
            focus={staffProfile.focus}
            stats={heroStats}
            onBookAppointment={() => setShowNewAppointment(true)}
            onOpenTeam={() => setShowAddStaff(true)}
            onOpenSchedule={() => setActiveTab("appointments")}
          />

          <StaffPortalAnalytics
            stats={analyticsStats}
            insights={analyticsInsights}
          />

          <StaffPortalTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            appointments={appointments}
            customers={customers}
            products={products}
            featuredStaff={featuredStaff}
            onCreateAppointment={() => setShowNewAppointment(true)}
            onEditAppointment={(id) => setEditingAppointmentId(id)}
            onAddStaff={() => setShowAddStaff(true)}
            onEditStaff={(member) => setEditingStaff(member)}
            nextAppointment={nextAppointment}
          />
        </div>
      </div>

      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        salonId={Number(effectiveSalonId) || 0}
        onCreated={() => setShowNewAppointment(false)}
      />

      <AppointmentEditModal
        isOpen={Boolean(editingAppointmentId)}
        onClose={() => setEditingAppointmentId(null)}
        appointmentId={editingAppointmentId}
        salonId={Number(effectiveSalonId) || 0}
        onUpdated={() => setEditingAppointmentId(null)}
      />

      <AddStaffModal
        isOpen={showAddStaff}
        onClose={() => setShowAddStaff(false)}
        salonId={Number(effectiveSalonId) || 0}
        salonSlug={derivedSalonSlug || "stygo-salon"}
        onAdded={() => setShowAddStaff(false)}
      />

      {editingStaff && (
        <EditStaffModal
          isOpen
          onClose={() => setEditingStaff(null)}
          staff={{
            ...editingStaff,
            staff_role_id: editingStaff.staff_role_id ?? 0,
          }}
          salonId={Number(effectiveSalonId) || 0}
          onUpdated={() => setEditingStaff(null)}
        />
      )}
    </>
  );
};

export default StaffPortal;

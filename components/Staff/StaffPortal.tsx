"use client";

import React, { useEffect, useMemo, useState } from "react";
import StaffPortalNavbar from "./StaffPortalNavbar";
import StaffPortalAnalytics from "./StaffPortalAnalytics";
import StaffPortalTabs from "./StaffPortalTabs/StaffPortalTabs";
import NewAppointmentModal from "@/components/Dashboard/Appointments/NewAppointmentModal";
import AppointmentEditModal from "@/components/Dashboard/Appointments/AppointmentEditModal";
import useSalonId from "@/hooks/useSalonId";
import {
  StaffPortalAppointment,
  StaffPortalCustomer,
  StaffPortalProduct,
} from "./staffPortalTypes";
import {
  getStaffProfile,
  getStaffDashboard,
  listStaffAppointments,
  listStaffCustomers,
  listStaffRetail,
  updateAppointmentStatus,
  StaffPortalAppointmentBackend,
  StaffPortalCustomerBackend,
  StaffPortalProductBackend,
  StaffPortalDashboard,
} from "@/libs/api/staffPortal";


type TabKey = "overview" | "appointments" | "schedule" | "customers" | "reviews" | "availability";

interface StaffProfile {
  fullName: string;
  role: string;
  salonName: string;
  salonSlug?: string;
  salonId?: number;
  staffId?: number;
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
    fullName: "",
    role: "",
    salonName: "",
    shiftWindow: "",
    focus: "",
  });

  const [appointments, setAppointments] = useState<StaffPortalAppointment[]>([]);
  const [customers, setCustomers] = useState<StaffPortalCustomer[]>([]);
  const [products, setProducts] = useState<StaffPortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<StaffPortalDashboard | null>(null);

  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    number | null
  >(null);

  // Map backend appointment to frontend type
  const mapAppointment = (
    appt: StaffPortalAppointmentBackend
  ): StaffPortalAppointment => {
    // Map status: backend uses 'pending', 'confirmed', 'completed', 'cancelled'
    // Frontend uses 'confirmed', 'checked-in', 'completed', 'cancelled'
    let status: StaffPortalAppointment["status"] = "confirmed";
    if (appt.status === "completed") status = "completed";
    else if (appt.status === "cancelled") status = "cancelled";
    else if (appt.status === "confirmed") status = "confirmed";
    // Note: 'checked-in' is not a backend status, so we'll use 'confirmed' for now

    return {
      id: appt.appointment_id,
      client: appt.customer_name || "",
      service: appt.services || "",
      status,
      time: appt.scheduled_time,
      duration: Number(appt.duration_minutes) || 0,
      price: parseFloat(String(appt.price)) || 0,
      notes: appt.notes,
    };
  };

  // Map backend customer to frontend type
  const mapCustomer = (
    customer: StaffPortalCustomerBackend
  ): StaffPortalCustomer => {
    // Ensure last_visit is valid or use a fallback
    let lastVisit = customer.last_visit;
    if (!lastVisit || isNaN(new Date(lastVisit).getTime())) {
      // If no valid last visit, use a date far in the past to indicate "never"
      lastVisit = new Date(0).toISOString();
    }
    
    return {
      id: customer.user_id,
      name: customer.full_name || "",
      favoriteService: customer.favorite_service || "",
      visits: Number(customer.total_visits) || 0,
      lastVisit,
      lifetimeValue: Number(customer.lifetime_value) || 0,
      phone: customer.phone,
      notes: customer.notes,
    };
  };

  // Map backend product to frontend type
  const mapProduct = (product: StaffPortalProductBackend): StaffPortalProduct => {
    return {
      id: product.product_id,
      name: product.name,
      brand: product.brand || "",
      retailPrice: parseFloat(String(product.price)) || 0,
      stock: product.stock || 0,
      attachRate: product.attach_rate || 0,
      hero: false,
    };
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if staff token exists - wait a bit if just logged in
        let staffToken =
          typeof window !== "undefined"
            ? localStorage.getItem("staffToken")
            : null;

        // If no token, wait a moment and check again (in case of redirect timing)
        if (!staffToken && typeof window !== "undefined") {
          await new Promise((resolve) => setTimeout(resolve, 100));
          staffToken = localStorage.getItem("staffToken");
        }

        if (!staffToken) {
          // Check if there's a regular token (might be logged in as owner)
          const regularToken =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;
          
          if (!regularToken) {
            setError("Not authenticated. Please log in.");
            setLoading(false);
            return;
          }
          
          // If there's a regular token but no staff token, they need to use staff portal login
          // Get salon slug from URL or redirect to staff login
          const pathParts = window.location.pathname.split('/');
          const salonSlugIndex = pathParts.indexOf('salon');
          const salonSlug = salonSlugIndex >= 0 && pathParts[salonSlugIndex + 1] 
            ? pathParts[salonSlugIndex + 1] 
            : null;
          
          if (salonSlug) {
            setError(`Staff authentication required. Please log in with your staff code and PIN at /salon/${salonSlug}/staff/login`);
            // Optionally redirect after a delay
            setTimeout(() => {
              window.location.href = `/salon/${salonSlug}/staff/login`;
            }, 2000);
          } else {
            setError("Staff authentication required. Please log in with your staff code and PIN.");
          }
          setLoading(false);
          return;
        }
        
        // Verify the token is actually a staff portal token by checking if it has the right structure
        // Decode the token to check (basic check without verification)
        try {
          const tokenParts = staffToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (!payload.staff_id && !payload.scope) {
              console.warn("Token doesn't appear to be a staff portal token");
              // Clear invalid token
              localStorage.removeItem("staffToken");
              setError("Invalid staff token. Please log in again with your staff code and PIN.");
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error("Error checking token:", e);
        }

        // Fetch profile
        const profile = await getStaffProfile();
        setStaffProfile({
          fullName: profile.full_name || "",
          role: profile.staff_role || "",
          salonName: profile.salon_name || "",
          salonSlug: ownerSalonSlug || undefined,
          salonId: profile.salon_id,
          staffId: profile.staff_id,
          email: profile.email,
          phone: profile.phone,
          shiftWindow: "",
          focus: "",
        });

        // Fetch dashboard
        const dashboardData = await getStaffDashboard();
        setDashboard(dashboardData);

        // Update shift window and focus from dashboard
        if (dashboardData.shift) {
          const start = dashboardData.shift.start
            ? new Date(dashboardData.shift.start).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })
            : "";
          const end = dashboardData.shift.end
            ? new Date(dashboardData.shift.end).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })
            : "";
          setStaffProfile((prev) => ({
            ...prev,
            shiftWindow: start && end ? `${start} – ${end}` : "",
            focus: dashboardData.shift.focus || "",
          }));
        }

        // Fetch appointments - get upcoming appointments, not just today
        const appointmentsData = await listStaffAppointments({
          limit: 50,
          range: "upcoming",
        });
        setAppointments(appointmentsData.data.map(mapAppointment));

        // Fetch customers
        const customersData = await listStaffCustomers({
          scope: "staff",
          limit: 20,
        });
        setCustomers(customersData.customers.map(mapCustomer));

        // Fetch products
        const productsData = await listStaffRetail({ limit: 20 });
        setProducts(productsData.products.map(mapProduct));
      } catch (err) {
        console.error("Error fetching staff portal data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ownerSalonSlug]);

  const derivedSalonName =
    staffProfile.salonName || ownerSalonName || "";

  // Removed unused derivedSalonSlug - keeping for potential future use
  // const _derivedSalonSlug = useMemo(() => {
  //   const rawSlug =
  //     staffProfile.salonSlug ||
  //     ownerSalonSlug ||
  //     derivedSalonName.toLowerCase();
  //   return rawSlug
  //     .trim()
  //     .toLowerCase()
  //     .replace(/\s+/g, "-")
  //     .replace(/[^a-z0-9-]/g, "");
  // }, [derivedSalonName, ownerSalonSlug, staffProfile.salonSlug]);

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
  const confirmedAppointments = appointments.filter(
    (appt) => appt.status === "confirmed" || appt.status === "checked-in"
  ).length;

  const nextAppointment = useMemo(() => {
    if (dashboard?.upcoming) {
      const mapped = mapAppointment({
        appointment_id: dashboard.upcoming.appointment_id,
        scheduled_time: dashboard.upcoming.scheduled_time,
        status: dashboard.upcoming.status || "confirmed",
        price: dashboard.upcoming.price || 0,
        customer_name: dashboard.upcoming.customer_name || "",
        customer_phone: dashboard.upcoming.customer_phone,
        customer_email: dashboard.upcoming.customer_email,
        services: dashboard.upcoming.services || "",
        duration_minutes: dashboard.upcoming.duration_minutes || 0,
        notes: dashboard.upcoming.notes,
      });
      // Only return if it's a valid appointment (has a client name and in the future)
      if (mapped.client && new Date(mapped.time) >= new Date()) {
        return mapped;
      }
    }
    const upcoming = [...appointments].filter(
      (appt) => {
        const apptDate = new Date(appt.time);
        return apptDate >= new Date() && 
               appt.status !== "cancelled" && 
               appt.status !== "completed" &&
               appt.client;
      }
    );
    return upcoming.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    )[0];
  }, [appointments, dashboard]);

  const newClientsThisMonth = customers.filter((c) => c.visits <= 3).length;

  const analyticsStats = useMemo(
    () => [
      {
        label: "Guests today",
        value: dashboard?.totals?.total?.toString() || todaysAppointments.length.toString(),
        change: dashboard?.shift?.focus || "",
        positive: true,
      },
      {
        label: "Confirmed",
        value: dashboard?.totals?.confirmed?.toString() || confirmedAppointments.toString(),
        change: "Keep under 10 min wait",
        positive: true,
      },
      {
        label: "Completed",
        value: dashboard?.totals?.completed?.toString() || completedAppointments.toString(),
        change: `${(dashboard?.totals?.pending || 0) + (dashboard?.totals?.confirmed || 0)} left to close`,
        positive: false,
      },
      {
        label: "Revenue today",
        value: `$${dashboard?.totals?.revenue_today ? Number(dashboard.totals.revenue_today).toFixed(0) : "0"}`,
        change: `$${dashboard?.recent_performance?.revenue ? Number(dashboard.recent_performance.revenue).toFixed(0) : "0"} this week`,
        positive: true,
      },
    ],
    [
      confirmedAppointments,
      completedAppointments,
      todaysAppointments.length,
      dashboard,
    ]
  );

  const analyticsInsights: Array<{
    title: string;
    description: string;
    metric: string;
    progress: number;
  }> = (dashboard as StaffPortalDashboard & { 
    insights?: Array<{
      title: string;
      description: string;
      metric: string;
      progress: number;
    }> 
  })?.insights || [];

  // Team members feature removed - staff can't manage other staff
  const featuredStaff: never[] = [];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 py-8 md:py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading staff portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 py-8 md:py-10 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                // Try to fetch data again
                const staffToken =
                  typeof window !== "undefined"
                    ? localStorage.getItem("staffToken")
                    : null;
                if (staffToken) {
                  window.location.reload();
                } else {
                  // Redirect to login if no token
                  const salonSlug = window.location.pathname.split("/")[2];
                  window.location.href = `/salon/${salonSlug}/staff/login`;
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {typeof window !== "undefined" && localStorage.getItem("staffToken")
                ? "Retry"
                : "Go to Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onOpenSchedule={() => setActiveTab("appointments")}
          />

          {analyticsStats.length > 0 && (
            <StaffPortalAnalytics
              stats={analyticsStats}
              insights={analyticsInsights}
            />
          )}

          <StaffPortalTabs
            activeTab={activeTab}
            onTabChange={(tab: TabKey) => setActiveTab(tab)}
            appointments={appointments}
            customers={customers}
            featuredStaff={featuredStaff}
            onCreateAppointment={() => setShowNewAppointment(true)}
            onEditAppointment={(id) => setEditingAppointmentId(id)}
            onAddStaff={() => {}}
            onEditStaff={() => {}}
            nextAppointment={nextAppointment}
            staffId={staffProfile.staffId}
            salonId={staffProfile.salonId}
            onUpdateAppointmentStatus={async (id, status) => {
              try {
                await updateAppointmentStatus(id, status);
                // Refresh appointments
                const appointmentsData = await listStaffAppointments({
                  limit: 50,
                  range: "upcoming",
                });
                setAppointments(appointmentsData.data.map(mapAppointment));
                // Refresh dashboard
                const dashboardData = await getStaffDashboard();
                setDashboard(dashboardData);
              } catch (err) {
                console.error("Error updating appointment status:", err);
                alert("Failed to update appointment status");
              }
            }}
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

    </>
  );
};

export default StaffPortal;

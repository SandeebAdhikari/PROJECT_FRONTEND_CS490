import { Download, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import SalonDashboardCard from "./SalonDashboardCard";
import { icons } from "@/libs/dashboard/dashboard.icons";
import useSalonId from "@/hooks/useSalonId";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

interface DashboardStats {
  totalRevenue: number;
  totalRevenuePrev: number;
  appointments: number;
  appointmentsPrev: number;
  newCustomers: number;
  newCustomersPrev: number;
  avgRating: number;
  avgRatingPrev: number;
  staffUtilization: number;
  customerRetention: number;
}

const SalonDashboard = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.full_name || user.email?.split("@")[0] || "");
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!salonId) return;

      try {
        setLoading(true);
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/overview?salonId=${salonId}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (res.ok && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchStats();
    }
  }, [salonId]);

  return (
    <div className="p-4 sm:px-8">
      <div className="sm:flex sm:justify-between w-full">
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold">
            Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground font-inter text-base mt-2 sm:text-lg">
            Your salon is performing excellently today. Here&apos;s your
            overview.
          </p>
        </div>

        <div className="flex mt-3 gap-2">
          <div className="relative">
            <Download className="absolute w-4 h-4 top-3 left-3 sm:top-4 sm:left-4" />
            <button className="border border-border rounded-lg py-3 px-4 text-xs sm:text-sm font-inter font-semibold hover:cursor-pointer hover:bg-accent shadow-soft-br">
              <span className="sm:hidden ml-6">Export</span>
              <span className="hidden sm:flex ml-6">Export Report</span>
            </button>
          </div>

          <div className="relative">
            <Plus className="absolute w-4 h-4 top-3 left-3 text-primary-foreground sm:top-4 sm:left-4" />
            <button className="border border-border rounded-lg py-3 px-4 text-xs sm:text-sm font-inter font-semibold bg-primary-light text-primary-foreground hover:cursor-pointer shadow-soft-br transition-smooth">
              <span className="sm:hidden ml-6">Actions</span>
              <span className="hidden sm:flex ml-6">Quick Actions</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
        {loadingSalon || loading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Loading dashboard...
          </div>
        ) : stats ? (
          <>
            <SalonDashboardCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              subtext={`vs $${stats.totalRevenuePrev.toLocaleString()} last period`}
              change={`${
                stats.totalRevenuePrev > 0
                  ? (((stats.totalRevenue - stats.totalRevenuePrev) /
                      stats.totalRevenuePrev) *
                      100 >=
                    0
                      ? "+"
                      : "") +
                    (
                      ((stats.totalRevenue - stats.totalRevenuePrev) /
                        stats.totalRevenuePrev) *
                      100
                    ).toFixed(1)
                  : "+0.0"
              }%`}
              icon={icons.DollarSign}
              trendIcon={
                stats.totalRevenue >= stats.totalRevenuePrev
                  ? icons.TrendingUp
                  : icons.TrendingDown
              }
            />
            <SalonDashboardCard
              title="Appointments"
              value={stats.appointments.toString()}
              subtext={`vs ${stats.appointmentsPrev} last period`}
              change={`${
                stats.appointmentsPrev > 0
                  ? (((stats.appointments - stats.appointmentsPrev) /
                      stats.appointmentsPrev) *
                      100 >=
                    0
                      ? "+"
                      : "") +
                    (
                      ((stats.appointments - stats.appointmentsPrev) /
                        stats.appointmentsPrev) *
                      100
                    ).toFixed(1)
                  : "+0.0"
              }%`}
              icon={icons.CalendarDays}
              trendIcon={
                stats.appointments >= stats.appointmentsPrev
                  ? icons.TrendingUp
                  : icons.TrendingDown
              }
            />
            <SalonDashboardCard
              title="New Customers"
              value={stats.newCustomers.toString()}
              subtext={`vs ${stats.newCustomersPrev} last period`}
              change={`${
                stats.newCustomersPrev > 0
                  ? (((stats.newCustomers - stats.newCustomersPrev) /
                      stats.newCustomersPrev) *
                      100 >=
                    0
                      ? "+"
                      : "") +
                    (
                      ((stats.newCustomers - stats.newCustomersPrev) /
                        stats.newCustomersPrev) *
                      100
                    ).toFixed(1)
                  : "+0.0"
              }%`}
              icon={icons.Users}
              trendIcon={
                stats.newCustomers >= stats.newCustomersPrev
                  ? icons.TrendingUp
                  : icons.TrendingDown
              }
            />
            <SalonDashboardCard
              title="Avg Rating"
              value={stats.avgRating.toFixed(1)}
              subtext={`vs ${stats.avgRatingPrev.toFixed(1)} last period`}
              change={`${
                stats.avgRatingPrev > 0
                  ? (((stats.avgRating - stats.avgRatingPrev) /
                      stats.avgRatingPrev) *
                      100 >=
                    0
                      ? "+"
                      : "") +
                    (
                      ((stats.avgRating - stats.avgRatingPrev) /
                        stats.avgRatingPrev) *
                      100
                    ).toFixed(1)
                  : "+0.0"
              }%`}
              icon={icons.Star}
              trendIcon={
                stats.avgRating >= stats.avgRatingPrev
                  ? icons.TrendingUp
                  : icons.TrendingDown
              }
            />
            <SalonDashboardCard
              title="Staff Utilization"
              value={`${(stats.staffUtilization * 100).toFixed(0)}%`}
              subtext="of available time"
              change={`${(stats.staffUtilization * 100).toFixed(1)}%`}
              icon={icons.Activity}
              trendIcon={icons.TrendingUp}
            />
            <SalonDashboardCard
              title="Customer Retention"
              value={`${(stats.customerRetention * 100).toFixed(0)}%`}
              subtext="repeat customers"
              change={`${(stats.customerRetention * 100).toFixed(1)}%`}
              icon={icons.UserCheck}
              trendIcon={icons.TrendingUp}
            />
          </>
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonDashboard;

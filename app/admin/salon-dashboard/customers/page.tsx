"use client";

import React, { useCallback, useEffect, useState } from "react";
import CustomerStatsCards, {
  CustomerStats,
} from "@/components/Dashboard/Customer/CustomerStatsCards";
import CustomerCard from "@/components/Dashboard/Customer/CustomerListTable";
import Header from "@/components/Dashboard/Header";
import { UserPlus } from "lucide-react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { API_ENDPOINTS } from "@/libs/api/config";
import useSalonId from "@/hooks/useSalonId";
import AddCustomerModal from "@/components/Dashboard/Customer/AddCustomerModal";

interface DirectoryCustomer {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  total_visits: number;
  total_spent: number;
  last_visit?: string | null;
  favorite_staff?: string | null;
  membership_tier?: string;
}

const defaultStats: CustomerStats = {
  totalCustomers: 0,
  vipCustomers: 0,
  totalRevenue: 0,
  avgSpend: 0,
};

const CustomersPage = () => {
  const { salonId, loadingSalon } = useSalonId();
  const [stats, setStats] = useState<CustomerStats>(defaultStats);
  const [customers, setCustomers] = useState<DirectoryCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!salonId) return;
    setLoading(true);
    setError(null);
    try {
      const statsPromise = fetchWithRefresh(
        API_ENDPOINTS.USERS.SALON_CUSTOMERS_STATS(salonId),
        { credentials: "include" }
      );
      const directoryPromise = fetchWithRefresh(
        API_ENDPOINTS.USERS.SALON_CUSTOMERS_DIRECTORY(salonId),
        { credentials: "include" }
      );

      const [statsRes, directoryRes] = await Promise.all([
        statsPromise,
        directoryPromise,
      ]);

      const statsPayload = await statsRes.json();
      const directoryPayload = await directoryRes.json();

      if (!statsRes.ok) {
        throw new Error(statsPayload?.error || "Failed to load stats");
      }
      if (!directoryRes.ok) {
        throw new Error(directoryPayload?.error || "Failed to load customers");
      }

      setStats({
        totalCustomers: Number(statsPayload?.stats?.total_customers ?? 0),
        vipCustomers: Number(statsPayload?.stats?.vip_customers ?? 0),
        totalRevenue: Number(statsPayload?.stats?.total_revenue ?? 0),
        avgSpend: Number(statsPayload?.stats?.avg_spend ?? 0),
      });

      setCustomers(directoryPayload?.customers || []);
    } catch (err) {
      console.error("Customer dashboard load error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load customer data"
      );
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) {
      loadData();
    }
  }, [salonId, loadData]);

  return (
    <div className="space-y-6 font-inter p-6 sm:p-8">
      <Header
        title="Customer Management"
        subtitle="Track your loyal customers and their details"
        primaryLabel="Add Customer"
        primaryIcon={UserPlus}
        showActions
        onPrimaryClick={() => setIsModalOpen(true)}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {loadingSalon || loading ? (
        <p className="text-sm text-muted-foreground">Loading customer data…</p>
      ) : (
        <>
          <CustomerStatsCards stats={stats} />

          <section>
            <h2 className="text-xl font-semibold mb-4">Customer Directory</h2>
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No customers yet. Add your first client to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <CustomerCard
                    key={customer.user_id}
                    name={customer.full_name}
                    email={customer.email}
                    phone={customer.phone}
                    totalVisits={customer.total_visits}
                    totalSpent={customer.total_spent}
                    lastVisit={customer.last_visit || undefined}
                    favoriteStaff={customer.favorite_staff || undefined}
                    membershipTier={customer.membership_tier}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        salonId={salonId}
        onAdded={loadData}
      />
    </div>
  );
};

export default CustomersPage;

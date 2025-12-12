"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Search,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { API_ENDPOINTS } from "@/libs/api/config";
import useSalonId from "@/hooks/useSalonId";

interface Payment {
  payment_id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  appointment_id: number | null;
  stripe_checkout_session_id: string | null;
  payment_link: string | null;
  created_at: string;
  customer_name: string;
}

interface PaymentStats {
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  averageTransaction: number;
}

export default function PaymentsPage() {
  const { salonId, loadingSalon } = useSalonId();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    averageTransaction: 0,
  });

  const fetchPayments = useCallback(async () => {
    if (!salonId) return;
    
    setLoading(true);
    setError(null);

    try {

      const response = await fetchWithRefresh(
        API_ENDPOINTS.PAYMENTS.SALON_PAYMENTS(salonId),
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      const paymentsList = data.payments || [];
      setPayments(paymentsList);
      setFilteredPayments(paymentsList);

      // Calculate stats
      const completed = paymentsList.filter(
        (p: Payment) => p.payment_status === "completed"
      );
      const pending = paymentsList.filter(
        (p: Payment) => p.payment_status === "pending"
      );
      const totalRevenue = completed.reduce(
        (sum: number, p: Payment) => sum + Number(p.amount),
        0
      );

      setStats({
        totalRevenue,
        completedPayments: completed.length,
        pendingPayments: pending.length,
        averageTransaction:
          completed.length > 0 ? totalRevenue / completed.length : 0,
      });
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) {
      fetchPayments();
    }
  }, [salonId, fetchPayments]);

  // Filter payments based on search and filters
  useEffect(() => {
    let filtered = [...payments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.customer_name?.toLowerCase().includes(query) ||
          p.payment_id.toString().includes(query) ||
          p.payment_method?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.payment_status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (p) => new Date(p.created_at) >= filterDate
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, statusFilter, dateFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const exportToCSV = () => {
    const headers = [
      "Payment ID",
      "Customer",
      "Amount",
      "Method",
      "Status",
      "Date",
    ];
    const rows = filteredPayments.map((p) => [
      p.payment_id,
      p.customer_name || "Unknown",
      p.amount,
      p.payment_method,
      p.payment_status,
      formatDate(p.created_at),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading || loadingSalon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (!salonId) {
    return (
      <div className="px-4 sm:px-8 pb-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          No salon associated with this account. Please ensure you are logged in as a salon owner.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Payment Tracking
            </h1>
            <p className="text-muted-foreground">
              Track and manage your salon revenue
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Completed Payments
                </p>
                <p className="text-xl font-bold text-foreground">
                  {stats.completedPayments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Payments
                </p>
                <p className="text-xl font-bold text-foreground">
                  {stats.pendingPayments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Transaction</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(stats.averageTransaction)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by customer name or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Payment ID
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Method
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        {payments.length === 0
                          ? "No payments yet"
                          : "No payments match your filters"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.payment_id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-foreground">
                        #{payment.payment_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {payment.customer_name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">
                        {formatCurrency(Number(payment.amount))}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">
                        {payment.payment_method || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(payment.payment_status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(payment.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          {filteredPayments.length > 0 && (
            <div className="border-t border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {filteredPayments.length} of {payments.length} payments
                </span>
                <span className="font-semibold text-foreground">
                  Total:{" "}
                  {formatCurrency(
                    filteredPayments
                      .filter((p) => p.payment_status === "completed")
                      .reduce((sum, p) => sum + Number(p.amount), 0)
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}


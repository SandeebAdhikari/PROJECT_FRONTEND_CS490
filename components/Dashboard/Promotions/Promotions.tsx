"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tag, Users, Send, CheckCircle2, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { getLoyalCustomers, sendPromotionToCustomers, LoyalCustomer } from "@/libs/api/notifications";
import { checkOwnerSalon } from "@/libs/api/salons";
import Header from "../Header";

const Promotions: React.FC = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [customers, setCustomers] = useState<LoyalCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [minVisits, setMinVisits] = useState(2);
  const [minSpent, setMinSpent] = useState(100);

  useEffect(() => {
    const fetchSalonId = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon?.salon_id) {
          setSalonId(result.salon.salon_id);
        } else {
          setError("No salon found. Please create a salon first.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching salon:", err);
        setError("Failed to load salon information");
        setLoading(false);
      }
    };

    fetchSalonId();
  }, []);

  const loadLoyalCustomers = useCallback(async () => {
    if (!salonId) return;

    try {
      setLoading(true);
      setError("");
      const result = await getLoyalCustomers(salonId, minVisits, minSpent);
      if (result.error) {
        setError(result.error);
        setCustomers([]);
      } else {
        setCustomers(result.customers || []);
      }
    } catch (err) {
      console.error("Error fetching loyal customers:", err);
      setError("Failed to load loyal customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [salonId, minVisits, minSpent]);

  useEffect(() => {
    if (salonId) {
      loadLoyalCustomers();
    }
  }, [salonId, loadLoyalCustomers]);

  const handleToggleCustomer = (userId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((c) => c.user_id));
    }
  };

  const handleSendPromotion = async () => {
    if (!salonId) {
      setError("Salon ID is required");
      return;
    }

    if (selectedCustomers.length === 0) {
      setError("Please select at least one customer");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a promotional message");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      const result = await sendPromotionToCustomers(
        salonId,
        selectedCustomers,
        message
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(
          `Promotional offer sent to ${result.notification_count || selectedCustomers.length} customer(s)!`
        );
        setMessage("");
        setSelectedCustomers([]);
      }
    } catch (err) {
      console.error("Error sending promotion:", err);
      setError("Failed to send promotional offer");
    } finally {
      setSending(false);
    }
  };

  if (loading && !salonId) {
    return (
      <div className="font-inter space-y-6 p-4 sm:p-6 lg:p-8">
        <Header
          title="Promotional Offers"
          subtitle="Send discounts and special offers to loyal customers"
          showActions={false}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter space-y-6 p-4 sm:p-6 lg:p-8">
      <Header
        title="Promotional Offers"
        subtitle="Send discounts and special offers to loyal customers"
        showActions={false}
      />

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          Filter Loyal Customers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Visits
            </label>
            <input
              type="number"
              min="1"
              value={minVisits}
              onChange={(e) => setMinVisits(Number(e.target.value) || 1)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Spent ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minSpent}
              onChange={(e) => setMinSpent(Number(e.target.value) || 0)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <button
          onClick={loadLoyalCustomers}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed text-sm font-inter"
        >
          {loading ? "Loading..." : "Refresh List"}
        </button>
      </div>

      {/* Customer List */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Loyal Customers ({customers.length})
          </h3>
          {customers.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary hover:underline"
            >
              {selectedCustomers.length === customers.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground text-sm">Loading customers...</p>
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No loyal customers found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customers.map((customer) => (
              <div
                key={customer.user_id}
                className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                  selectedCustomers.includes(customer.user_id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => handleToggleCustomer(customer.user_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.user_id)}
                      onChange={() => handleToggleCustomer(customer.user_id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{customer.visits} visits</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>${customer.total_spent.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Promotion Form */}
      {selectedCustomers.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send Promotional Offer ({selectedCustomers.length} selected)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Promotional Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="E.g., Get 20% off your next visit! Use code SAVE20 at checkout. Valid until end of month."
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-inter"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This message will be sent as a notification to selected customers.
              </p>
            </div>
            <button
              onClick={handleSendPromotion}
              disabled={sending || !message.trim()}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed font-inter flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to {selectedCustomers.length} Customer(s)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;


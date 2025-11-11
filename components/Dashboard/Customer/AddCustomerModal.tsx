"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonId: number | null;
  onAdded?: () => void;
}

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  notes: "",
};

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  salonId,
  onAdded,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonId) {
      setMessage("No salon selected.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/salon-customers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ salon_id: salonId, ...form }),
        }
      );

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Failed to add customer");
      }

      setMessage("Customer added and notified via email.");
      setForm(initialForm);
      onAdded?.();
      onClose();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to add customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-inter">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-smooth"
          aria-label="Close add customer modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-center mb-6">
          Add New Customer
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2"
              placeholder="Jane Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-lg px-3 py-2"
                placeholder="jane@domain.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-3 py-2"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP</label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2"
              placeholder="Preferred stylist, allergies, etc."
            />
          </div>

          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white ${
              loading
                ? "bg-primary/60 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark transition-smooth"
            }`}
          >
            {loading ? "Saving..." : "Save Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;

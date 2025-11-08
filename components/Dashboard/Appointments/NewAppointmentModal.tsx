"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Customer {
  user_id: number;
  full_name: string;
}

interface Service {
  service_id: number;
  custom_name: string;
  duration: number;
  price: number;
}

const NewAppointmentModal = ({
  isOpen,
  onClose,
  salonId,
}: {
  isOpen: boolean;
  onClose: () => void;
  salonId: number;
}) => {
  const [form, setForm] = useState({
    user_id: "",
    service_id: "",
    date: new Date(),
    time: "",
    notes: "",
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (!isOpen || !salonId) return;

    // Parse user data from localStorage
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userData ? JSON.parse(userData) : null;

    // Determine which salon to fetch for (owner/staff)
    const currentSalonId = user?.salon_id || salonId;

    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/salon-customers?salon_id=${currentSalonId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.error("Failed to load customers:", data);
          setCustomers([]);
        }
      } catch (error) {
        console.error("Fetch customers error:", error);
        setCustomers([]);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/salons/${currentSalonId}/services`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setServices(data);
        } else {
          console.error("Failed to load services:", data);
          setServices([]);
        }
      } catch (error) {
        console.error("Fetch services error:", error);
        setServices([]);
      }
    };

    fetchCustomers();
    fetchServices();
  }, [isOpen, salonId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = form.date.toISOString().split("T")[0];

    const payload = {
      salon_id: salonId,
      user_id: Number(form.user_id),
      service_id: Number(form.service_id),
      scheduled_time: `${dateStr}T${form.time}`,
      price: selectedService?.price || 0,
      duration: selectedService?.duration || 0,
      status: "booked",
      notes: form.notes,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create appointment");
        return;
      }

      alert("Appointment added successfully!");
      console.log("Appointment created:", data);
      onClose();
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Something went wrong while creating the appointment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 font-inter relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-smooth"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center text-foreground">
          Add New Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer selection */}
          <div>
            <label htmlFor="user_id" className="block text-sm font-medium mb-1">
              Customer <span className="text-red-500">*</span>
            </label>
            <select
              id="user_id"
              name="user_id"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
              required
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.user_id} value={c.user_id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="service_id"
              className="block text-sm font-medium mb-1"
            >
              Service <span className="text-red-500">*</span>
            </label>
            <select
              id="service_id"
              name="service_id"
              value={form.service_id}
              onChange={(e) => {
                const s = services.find(
                  (srv) => srv.service_id === Number(e.target.value)
                );
                setForm({ ...form, service_id: e.target.value });
                setSelectedService(s || null);
              }}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
              required
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.custom_name} (${s.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="w-full border border-border rounded-lg p-2 bg-white max-h-[330px] overflow-y-auto">
              <DatePicker
                selected={form.date}
                onChange={(date) => date && setForm({ ...form, date })}
                inline
                minDate={new Date()}
                calendarStartDay={0}
              />
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="time"
              type="time"
              name="time"
              title="Start Time"
              placeholder="HH:MM"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special requests..."
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          {selectedService && (
            <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
              <span>Duration: {selectedService.duration} min</span>
              <span>Price: ${selectedService.price.toFixed(2)}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-smooth"
          >
            Add Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;

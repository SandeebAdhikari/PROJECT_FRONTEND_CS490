"use client";
import React, { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { API_ENDPOINTS } from "@/libs/api/config";
import {
  AppointmentStatus,
  appointmentStatusOptions,
  normalizeAppointmentStatus,
} from "@/libs/constants/appointments";
import "react-datepicker/dist/react-datepicker.css";

interface Customer {
  user_id: number;
  full_name: string;
  email?: string;
  phone?: string;
}

interface Staff {
  staff_id: number;
  full_name: string;
}

interface Service {
  service_id: number;
  custom_name: string;
  duration: number;
  price: number | string;
}

const NewAppointmentModal = ({
  isOpen,
  onClose,
  salonId,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  salonId: number;
  onCreated?: () => Promise<void> | void;
}) => {
  const [form, setForm] = useState({
    service_ids: [] as number[],
    staff_id: "",
    date: new Date(),
    time: "",
    notes: "",
    price: 0,
    status: "pending" as AppointmentStatus,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [createCustomerMode, setCreateCustomerMode] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const userData =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userData ? JSON.parse(userData) : null;
    // Use user's salon_id from localStorage, or fall back to prop, or try staffUser
    const staffUserData = typeof window !== "undefined" ? localStorage.getItem("staffUser") : null;
    const staffUser = staffUserData ? JSON.parse(staffUserData) : null;
    // Also check for salon.id in case salon_id is nested
    const currentSalonId = user?.salon_id || salonId || staffUser?.salon_id || staffUser?.salon?.id;
    
    console.log("[NewAppointmentModal] salonId resolution:", {
      propSalonId: salonId,
      userSalonId: user?.salon_id,
      staffUserSalonId: staffUser?.salon_id,
      staffUserNestedSalonId: staffUser?.salon?.id,
      resolved: currentSalonId
    });
    
    if (!currentSalonId) {
      console.warn("No salonId available for fetching services");
      return;
    }

    const fetchStaff = async () => {
      const res = await fetchWithRefresh(
        API_ENDPOINTS.STAFF.GET_SALON_STAFF(currentSalonId)
      );

      const data = await res.json();
      if (res.ok) {
        const normalizedStaff = Array.isArray(data)
          ? data
          : Array.isArray((data as { staff?: Staff[] })?.staff)
          ? (data as { staff: Staff[] }).staff
          : [];

        setStaffList(normalizedStaff);
      }
    };

    const fetchServices = async () => {
      console.log("[NewAppointmentModal] Fetching services for salonId:", currentSalonId);
      try {
        const res = await fetchWithRefresh(
          API_ENDPOINTS.SALONS.SERVICES(currentSalonId),
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("[NewAppointmentModal] Services response:", { ok: res.ok, data });
        if (res.ok && Array.isArray(data))
          setServices(data.map((s) => ({ ...s, price: Number(s.price) })));
      } catch (err) {
        console.error("[NewAppointmentModal] Failed to fetch services:", err);
      }
    };

    fetchStaff();
    fetchServices();
  }, [isOpen, salonId]);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!customerQuery.trim()) {
        setCustomers([]);
        return;
      }

      const res = await fetchWithRefresh(
        API_ENDPOINTS.USERS.SALON_CUSTOMERS(salonId, customerQuery),
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setCustomers(data);
    };

    const delayDebounce = setTimeout(fetchCustomers, 400);
    return () => clearTimeout(delayDebounce);
  }, [customerQuery, salonId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Step 1: Check duplicate customers
    if (createCustomerMode) {
      try {
        const checkRes = await fetchWithRefresh(
          API_ENDPOINTS.USERS.SALON_CUSTOMERS(salonId, newCustomer.phone || newCustomer.email),
          { credentials: "include" }
        );
        const existingMatches = await checkRes.json();

        if (existingMatches?.length > 0) {
          const confirmUse = confirm(
            ` A customer named "${existingMatches[0].full_name}" already exists.\nUse their profile instead?`
          );
          if (confirmUse) {
            setCreateCustomerMode(false);
            setSelectedCustomer(existingMatches[0]);
            setCustomerQuery(existingMatches[0].full_name);
            setLoading(false);
            return;
          } else {
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Customer duplicate check failed:", err);
      }
    }

    const dateStr = form.date.toISOString().split("T")[0];

    const selectedServices = services
      .filter((s) => form.service_ids.includes(s.service_id))
      .map((s) => ({
        service_id: s.service_id,
        duration: s.duration,
        price: s.price,
      }));

    const totalPrice = selectedServices.reduce(
      (sum, s) => sum + Number(s.price),
      0
    );

    const payload = {
      salonId,
      staffId: form.staff_id ? Number(form.staff_id) : null,
      services: selectedServices,
      scheduledTime: `${dateStr}T${form.time}`,
      price: totalPrice,
      notes: form.notes,
      status: form.status,
      ...(createCustomerMode
        ? { ...newCustomer }
        : {
            email: selectedCustomer?.email,
            phone: selectedCustomer?.phone,
            firstName: selectedCustomer?.full_name?.split(" ")[0] || "",
            lastName: selectedCustomer?.full_name?.split(" ")[1] || "",
          }),
    };

    const res = await fetchWithRefresh(
      API_ENDPOINTS.APPOINTMENTS.BOOK,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) alert(data.error || "Failed to create appointment");
    else {
      alert("Appointment created! Payment link sent to customer's email.");
      if (onCreated) await Promise.resolve(onCreated());
      onClose();
      setForm({
        service_ids: [],
        staff_id: "",
        date: new Date(),
        time: "",
        notes: "",
        price: 0,
        status: "pending",
      });
      setSelectedCustomer(null);
      setCustomerQuery("");
      setCreateCustomerMode(false);
      setNewCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 font-inter relative scrollbar-hide">
        <button
          type="button"
          onClick={onClose}
          title="Close"
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-smooth"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-center text-foreground">
          Add New Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div className="relative z-20">
            <label className="block text-sm font-medium mb-1">
              Customer <span className="text-primary">*</span>
            </label>
            {!createCustomerMode ? (
              <>
                <input
                  type="text"
                  placeholder="Search by name, phone, or email"
                  value={customerQuery}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setSelectedCustomer(null);
                  }}
                  className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
                />
                {customerQuery &&
                  (customers.length > 0 ? (
                    <ul className="absolute left-0 right-0 border border-border rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow-lg z-10">
                      {customers.map((c) => (
                        <li
                          key={c.user_id}
                          onClick={() => {
                            setSelectedCustomer(c);
                            setCustomerQuery(c.full_name);
                            setCustomers([]);
                          }}
                          className={`px-3 py-2 cursor-pointer hover:bg-primary-light/10 ${
                            selectedCustomer?.user_id === c.user_id
                              ? "bg-primary-light/20"
                              : ""
                          }`}
                        >
                          {c.full_name}{" "}
                          <span className="text-xs text-gray-500">
                            ({c.phone || c.email})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 relative z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setCustomers([]);
                          setCreateCustomerMode(true);
                        }}
                        className="flex items-center gap-2 text-primary font-medium cursor-pointer hover:underline transition-smooth"
                      >
                        <PlusCircle className="w-4 h-4" /> Create new customer
                      </button>
                    </div>
                  ))}
              </>
            ) : (
              <div className="space-y-3 border border-border p-3 rounded-lg">
                <h3 className="font-semibold text-sm text-foreground">
                  New Customer Details
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="First name"
                    value={newCustomer.firstName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        firstName: e.target.value,
                      })
                    }
                    className="w-1/2 border border-border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={newCustomer.lastName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        lastName: e.target.value,
                      })
                    }
                    className="w-1/2 border border-border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="w-full border border-border rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  className="w-full border border-border rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  className="w-full border border-border rounded-lg px-3 py-2"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newCustomer.city}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, city: e.target.value })
                    }
                    className="w-1/2 border border-border rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newCustomer.state}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, state: e.target.value })
                    }
                    className="w-1/2 border border-border rounded-lg px-3 py-2"
                  />
                </div>
                <input
                  type="text"
                  placeholder="ZIP"
                  value={newCustomer.zip}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, zip: e.target.value })
                  }
                  className="w-full border border-border rounded-lg px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setCreateCustomerMode(false)}
                  className="text-sm text-foreground hover:underline cursor-pointer"
                >
                  Cancel create customer
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Staff (optional)
            </label>
            <select
              id="staff-select"
              title="Select staff (optional)"
              value={form.staff_id}
              onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
            >
              <option value="">Auto-assign available staff</option>
              {staffList.map((s) => (
                <option
                  key={s.staff_id}
                  value={s.staff_id}
                  className="text-border"
                >
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Status <span className="text-primary">*</span>
            </label>
            <select
              title="Select appointment status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: normalizeAppointmentStatus(e.target.value),
                })
              }
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
            >
              {appointmentStatusOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Services <span className="text-red-500">*</span>
            </label>
            <div className="border border-border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground">Loading services...</p>
              )}
              {services.map((s) => {
                const checked = form.service_ids.includes(s.service_id);
                return (
                  <label
                    key={s.service_id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        let updated: number[];
                        if (checked) {
                          updated = form.service_ids.filter(
                            (id) => id !== s.service_id
                          );
                        } else {
                          updated = [...form.service_ids, s.service_id];
                        }
                        const total = services
                          .filter((sv) => updated.includes(sv.service_id))
                          .reduce((sum, sv) => sum + Number(sv.price), 0);
                        setForm({
                          ...form,
                          service_ids: updated,
                          price: total,
                        });
                      }}
                      className="accent-primary"
                    />
                    <span className="text-sm">
                      {s.custom_name} (${Number(s.price).toFixed(2)})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="border border-border rounded-lg p-2">
              <DatePicker
                selected={form.date}
                onChange={(date) => date && setForm({ ...form, date })}
                inline
                minDate={new Date()}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              title="Start Time"
              placeholder="HH:MM"
              aria-label="Start Time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              placeholder="Add any notes or special instructions (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          {form.price > 0 && (
            <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
              <span>Total Selected Services:</span>
              <span>${form.price.toFixed(2)}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white ${
              loading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-smooth"
            }`}
          >
            {loading
              ? "Adding..."
              : createCustomerMode
              ? "Add Customer & Book"
              : "Add Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;

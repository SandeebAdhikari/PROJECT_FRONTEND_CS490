"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, DollarSign, User, Scissors } from "lucide-react";
import { bookAppointment } from "@/libs/api";
import data from "@/data/data.json";

interface Staff {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  specialties: string[];
  color: string;
}

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
}

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const salonId = searchParams.get("salonId") || "1";
  const preSelectedService = searchParams.get("service") || "";
  const preSelectedPrice = searchParams.get("price") || "";

  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    serviceId: "",
    staffId: "",
    date: "",
    time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedService = availableServices.find(s => s.id.toString() === formData.serviceId);
  const selectedStaff = availableStaff.find(s => s.id.toString() === formData.staffId);

  useEffect(() => {
    const staffData = (data.staff as Record<string, Staff[]>)[salonId] || [];
    const servicesData = (data.services as Record<string, Service[]>)[salonId] || [];
    
    setAvailableStaff(staffData);
    setAvailableServices(servicesData);

    if (preSelectedService && servicesData.length > 0) {
      const matchingService = servicesData.find(s => s.name === preSelectedService);
      if (matchingService) {
        setFormData(prev => ({ ...prev, serviceId: matchingService.id.toString() }));
      }
    }
  }, [salonId, preSelectedService]);

  useEffect(() => {
    if (formData.date && formData.staffId) {
      const slots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00"
      ];
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date, formData.staffId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.serviceId) {
      setError("Please select a service");
      return;
    }
    if (!formData.staffId) {
      setError("Please select a stylist");
      return;
    }
    if (!formData.date || !formData.time) {
      setError("Please select date and time");
      return;
    }

    setLoading(true);

    try {
      const scheduledTime = `${formData.date}T${formData.time}:00`;

      await bookAppointment({
        salon_id: parseInt(salonId),
        staff_id: parseInt(formData.staffId),
        service_id: parseInt(formData.serviceId),
        scheduled_time: scheduledTime,
        price: selectedService?.price || parseFloat(preSelectedPrice),
        notes: formData.notes,
      });

      alert("Appointment booked successfully!");
      router.push("/customer/my-profile");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to book appointment";
      setError(errorMessage);
      
      if (errorMessage.includes("login")) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Book Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">
              <Scissors className="w-4 h-4 inline mr-2" />
              Select Service
            </label>
            <div className="grid grid-cols-1 gap-3">
              {availableServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceId: service.id.toString() })}
                  className={`text-left p-4 border rounded-lg transition ${
                    formData.serviceId === service.id.toString()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${service.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Select Stylist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableStaff.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, staffId: staff.id.toString() })}
                  className={`text-left p-4 border rounded-lg transition ${
                    formData.staffId === staff.id.toString()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${staff.color} flex items-center justify-center text-white font-bold`}>
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{staff.name}</h3>
                      <p className="text-xs text-muted-foreground">{staff.role}</p>
                      <p className="text-xs text-yellow-600">★ {staff.rating} ({staff.reviews} reviews)</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              min={minDate}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time Slot
            </label>
            {!formData.date || !formData.staffId ? (
              <p className="text-sm text-muted-foreground py-4">
                Please select a stylist and date first
              </p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, time: slot })}
                    className={`px-3 py-2 text-sm border rounded-lg transition ${
                      formData.time === slot
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              rows={3}
              placeholder="Any special requests or notes..."
            />
          </div>

          {selectedService && selectedStaff && formData.date && formData.time && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Service:</span> {selectedService.name}</p>
                <p><span className="text-muted-foreground">Stylist:</span> {selectedStaff.name}</p>
                <p><span className="text-muted-foreground">Date:</span> {new Date(formData.date).toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Time:</span> {formData.time}</p>
                <p><span className="text-muted-foreground">Duration:</span> {selectedService.duration}</p>
                <p className="font-semibold text-base mt-2">
                  <span className="text-muted-foreground">Total:</span> ${selectedService.price}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;

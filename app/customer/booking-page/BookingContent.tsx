"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, DollarSign, User, Scissors } from "lucide-react";
import { bookAppointment } from "@/libs/api";
import { API_ENDPOINTS } from "@/libs/api/config";
import data from "@/data/data.json";
import { useCart } from "@/hooks/useCart";

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

interface BackendStaff {
  staff_id: number;
  full_name?: string;
  staff_role?: string;
  role?: string;
  specialization?: string;
  avg_rating?: number;
  review_count?: number;
}

interface BackendService {
  service_id: number;
  custom_name?: string;
  category_name: string;
  description?: string;
  duration?: number;
  price?: string;
}

const BookingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCart();

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

  const selectedService = availableServices.find(
    (s) => s.id.toString() === formData.serviceId
  );
  const selectedStaff = availableStaff.find(
    (s) => s.id.toString() === formData.staffId
  );

  // -------------------------
  // FETCH STAFF + SERVICES
  // -------------------------
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

              const staffUrl = API_ENDPOINTS.SALONS.STAFF(salonId);
              const servicesUrl = API_ENDPOINTS.SALONS.SERVICES(salonId);

              console.log("Fetching staff from:", staffUrl);
              console.log("Fetching services from:", servicesUrl);

        // Use Promise.allSettled to handle individual failures gracefully
        const [staffResult, servicesResult] = await Promise.allSettled([
          fetch(staffUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
          fetch(servicesUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
        ]);

        // Handle staff response
        let staffResponse;
        if (staffResult.status === "fulfilled") {
          staffResponse = staffResult.value;
        } else {
          console.error("Staff fetch failed:", staffResult.reason);
          // Don't throw - fall back to local data
          staffResponse = {
            ok: false,
            status: 0,
            json: async () => ({ error: "Network error" }),
          };
        }

        // Handle services response
        let servicesResponse;
        if (servicesResult.status === "fulfilled") {
          servicesResponse = servicesResult.value;
        } else {
          console.error("Services fetch failed:", servicesResult.reason);
          // Don't throw - fall back to local data
          servicesResponse = {
            ok: false,
            status: 0,
            json: async () => ({ error: "Network error" }),
          };
        }

        if (staffResponse.ok && servicesResponse.ok) {
          const staffData = await staffResponse.json();
          const backendServices = await servicesResponse.json();

          // Backend returns { staff: [...] }, so extract the array
          const backendStaff = staffData.staff || staffData || [];

          const transformedStaff: Staff[] = Array.isArray(backendStaff)
            ? backendStaff.map((s: BackendStaff) => ({
                id: s.staff_id,
                name: s.full_name || "Stylist",
                role: s.staff_role || s.role || "Stylist",
                rating: s.avg_rating || 4.5,
                reviews: s.review_count || 0,
                specialties: s.specialization ? [s.specialization] : [],
                color: "bg-blue-400",
              }))
            : [];

          const transformedServices: Service[] = backendServices.map(
            (s: BackendService) => ({
              id: s.service_id,
              name: s.custom_name || s.category_name,
              category: s.category_name,
              description: s.description || "",
              duration: `${s.duration || 30} min`,
              price: parseFloat(s.price || "0"),
            })
          );

          setAvailableStaff(transformedStaff);
          setAvailableServices(transformedServices);

          // Auto-select service if provided
          if (preSelectedService) {
            const matchingService = transformedServices.find(
              (s) => s.name === preSelectedService
            );
            if (matchingService) {
              setFormData((prev) => ({
                ...prev,
                serviceId: matchingService.id.toString(),
              }));
            }
          }
        } else {
          // If responses are not ok, log the error
          const staffError = staffResponse.ok
            ? null
            : await staffResponse
                .json()
                .catch(() => ({ error: `HTTP ${staffResponse.status}` }));
          const servicesError = servicesResponse.ok
            ? null
            : await servicesResponse
                .json()
                .catch(() => ({ error: `HTTP ${servicesResponse.status}` }));

          console.error("Failed to fetch salon data:", {
            staff: staffError,
            services: servicesError,
            staffStatus: staffResponse.status,
            servicesStatus: servicesResponse.status,
          });

          // LOCAL FALLBACK (data.json)
          const staffData =
            (data.staff as Record<string, Staff[]>)[salonId] || [];
          const servicesData =
            (data.services as Record<string, Service[]>)[salonId] || [];
          setAvailableStaff(staffData);
          setAvailableServices(servicesData);
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);

        // Show user-friendly error
        if (error instanceof Error) {
          setError(`Failed to load salon data: ${error.message}`);
        }

        // LOCAL FALLBACK (data.json)
        const staffData =
          (data.staff as Record<string, Staff[]>)[salonId] || [];
        const servicesData =
          (data.services as Record<string, Service[]>)[salonId] || [];

        setAvailableStaff(staffData);
        setAvailableServices(servicesData);
      }
    };

    fetchSalonData();
  }, [salonId, preSelectedService]);

  // -------------------------
  // FETCH AVAILABLE TIME SLOTS
  // -------------------------
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.date || !formData.staffId || !salonId) {
        setAvailableSlots([]);
        return;
      }

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const serviceId = formData.serviceId || undefined;
        const url = API_ENDPOINTS.BOOKINGS.AVAILABLE_SLOTS(
          salonId,
          formData.staffId,
          formData.date,
          serviceId
        );

        console.log("Fetching available slots from:", url);
        console.log("Request params:", { salonId, staffId: formData.staffId, date: formData.date, serviceId: formData.serviceId });
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        console.log("Response status:", response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log("Available slots response:", data);
          setAvailableSlots(data.slots || []);
        } else {
          let errorMessage = `HTTP ${response.status}`;
          let errorDetails: Record<string, unknown> = {
            status: response.status,
            statusText: response.statusText,
            url: url,
          };
          
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const errorData = await response.json();
              errorMessage = errorData.error || errorData.message || errorMessage;
              errorDetails.errorData = errorData;
            } else {
              const text = await response.text();
              if (text) {
                errorMessage = text;
                errorDetails.responseText = text;
              } else {
                errorMessage = response.statusText || errorMessage;
                errorDetails.note = "Empty response body";
              }
            }
          } catch (parseError) {
            errorMessage = response.statusText || errorMessage;
            errorDetails.parseError = parseError instanceof Error ? parseError.message : String(parseError);
          }
          
          console.error("=== FAILED TO FETCH AVAILABLE SLOTS (Non-OK Response) ===");
          console.error("Status:", response.status, response.statusText);
          console.error("URL:", url);
          console.error("Error message:", errorMessage);
          console.error("Error details:", JSON.stringify(errorDetails, null, 2));
          console.error("===========================================================");
          
          // Even if there's an error, try to show default slots or empty array
          setAvailableSlots([]);
        }
      } catch (error) {
        // Better error handling for network errors or other exceptions
        let errorMessage = "Unknown error";
        let errorName = "Unknown";
        let errorStack: string | undefined;
        
        if (error instanceof Error) {
          errorMessage = error.message || "Unknown error";
          errorName = error.name || "Error";
          errorStack = error.stack;
        } else if (typeof error === "string") {
          errorMessage = error;
        } else if (error && typeof error === "object") {
          // Try to extract useful info from error object
          errorMessage = (error as { message?: string }).message || JSON.stringify(error);
          errorName = (error as { name?: string }).name || "Error";
        } else {
          errorMessage = String(error);
        }
        
        const errorDetails = {
          message: errorMessage,
          name: errorName,
          stack: errorStack,
          url: API_ENDPOINTS.BOOKINGS.AVAILABLE_SLOTS(
            salonId,
            formData.staffId,
            formData.date,
            formData.serviceId || undefined
          ),
          salonId,
          staffId: formData.staffId,
          date: formData.date,
          serviceId: formData.serviceId,
          errorType: error instanceof TypeError ? "TypeError" : 
                     error instanceof SyntaxError ? "SyntaxError" :
                     "Unknown",
          rawError: error,
        };
        
        // Log error in multiple ways to ensure we capture it
        console.error("=== ERROR FETCHING AVAILABLE SLOTS ===");
        console.error("Error message:", errorMessage);
        console.error("Error name:", errorName);
        console.error("Error details:", JSON.stringify(errorDetails, null, 2));
        console.error("Raw error:", error);
        console.error("Error type:", typeof error);
        console.error("Error constructor:", error?.constructor?.name);
        if (errorStack) {
          console.error("Stack trace:", errorStack);
        }
        console.error("========================================");
        
        setAvailableSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [formData.date, formData.staffId, formData.serviceId, salonId]);

  // -------------------------
  // SUBMIT BOOKING
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.serviceId) return setError("Please select a service");
    if (!formData.staffId) return setError("Please select a stylist");
    if (!formData.date || !formData.time)
      return setError("Please select date and time");

    setLoading(true);

    try {
      const scheduledTime = `${formData.date}T${formData.time}:00`;

      const result = await bookAppointment({
        salon_id: parseInt(salonId),
        staff_id: parseInt(formData.staffId),
        service_id: parseInt(formData.serviceId),
        scheduled_time: scheduledTime,
        price: selectedService?.price || parseFloat(preSelectedPrice),
        notes: formData.notes,
      });

      // Add appointment to cart (both local and backend)
      const appointmentId =
        result.appointmentId || result.appointment_id || result.id;
      if (appointmentId && selectedService && selectedStaff) {
        // Add to local cart
        cart.addService({
          appointment_id: appointmentId,
          salon_id: parseInt(salonId),
          salon_name: "Salon", // You might want to fetch this
          service_id: parseInt(formData.serviceId),
          service_name: selectedService.name,
          staff_id: parseInt(formData.staffId),
          staff_name: selectedStaff.name,
          scheduled_time: scheduledTime,
          price: selectedService.price,
          notes: formData.notes,
        });

        // Also add to backend cart
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await fetch(API_ENDPOINTS.SHOP.ADD_APPOINTMENT_TO_CART, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                appointment_id: appointmentId,
                salon_id: parseInt(salonId),
              }),
            });
            
            if (response.ok) {
              console.log("[Booking] Appointment added to backend cart");
            } else {
              console.error("[Booking] Failed to add appointment to backend cart");
            }
          }
        } catch (err) {
          console.error("[Booking] Error adding appointment to backend cart:", err);
        }

        // Redirect to cart
        router.push(`/customer/cart?salonId=${salonId}`);
      } else {
        alert("Appointment booked successfully!");
        router.push("/customer/my-profile");
      }
    } catch (err) {
      console.error("🔴 Booking error caught:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to book appointment";
      console.error("🔴 Error message:", errorMessage);
      setError(errorMessage);

      if (errorMessage.includes("login")) {
        setTimeout(() => router.push("/login"), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  // Helper function to convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // -------------------------
  // RETURN UI
  // -------------------------
  return (
    <div className="min-h-screen bg-muted p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft-br">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Book Appointment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SERVICES */}
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
                  onClick={() =>
                    setFormData({
                      ...formData,
                      serviceId: service.id.toString(),
                    })
                  }
                  className={`text-left p-4 border rounded-lg transition ${
                    formData.serviceId === service.id.toString()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {service.description}
                  </p>

                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />${service.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STAFF */}
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
                  onClick={() =>
                    setFormData({ ...formData, staffId: staff.id.toString() })
                  }
                  className={`text-left p-4 border rounded-lg transition ${
                    formData.staffId === staff.id.toString()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${staff.color} flex items-center justify-center text-white font-bold`}
                    >
                      {staff.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm">{staff.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {staff.role}
                      </p>
                      <p className="text-xs text-yellow-600">
                        ★ {staff.rating} ({staff.reviews} reviews)
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              min={minDate}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-border rounded-lg"
              placeholder="Select a date"
              required
            />
          </div>

          {/* TIME */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Select Time Slot
            </label>

            {!formData.date || !formData.staffId ? (
              <p className="text-sm text-muted-foreground py-4">
                Please select a stylist and date first
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No available time slots for this date. Please try another date.
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
                    {formatTime12Hour(slot)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-border rounded-lg"
              placeholder="Any special requests?"
            />
          </div>

          {/* SUMMARY CARD */}
          {selectedService &&
            selectedStaff &&
            formData.date &&
            formData.time && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Booking Summary</h3>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Service:</span>{" "}
                    {selectedService.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Stylist:</span>{" "}
                    {selectedStaff.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    {new Date(formData.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time:</span>{" "}
                    {formatTime12Hour(formData.time)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    {selectedService.duration}
                  </p>
                  <p className="font-semibold text-base mt-2">
                    <span className="text-muted-foreground">Total:</span> $
                    {selectedService.price}
                  </p>
                </div>
              </div>
            )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingContent;

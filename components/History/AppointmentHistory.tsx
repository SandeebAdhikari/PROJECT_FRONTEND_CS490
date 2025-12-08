"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Edit2, X } from "lucide-react";
import { getAppointmentHistory, AppointmentHistory as AppointmentHistoryType } from "@/libs/api/history";
import { API_ENDPOINTS } from "@/libs/api/config";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AppointmentHistoryProps {
  filter?: "upcoming" | "past";
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({ filter = "past" }) => {
  const [appointments, setAppointments] = useState<AppointmentHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<number | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentHistoryType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    loadHistory();
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadHistory();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const result = await getAppointmentHistory();
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.appointments) {
      setAppointments(result.appointments);
    } else {
      setAppointments([]);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const res = await fetchWithRefresh(
        API_ENDPOINTS.BOOKINGS.CANCEL(appointmentId),
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Appointment cancelled successfully!");
        loadHistory();
      } else {
        alert(data.error || "Failed to cancel appointment.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong while cancelling appointment.");
    }
  };

  const fetchAvailableSlots = async (date: Date, appointment: AppointmentHistoryType) => {
    if (!appointment.salon_id || !appointment.staff_id) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    setSelectedTimeSlot(null); // Clear selection when fetching new slots
    setAvailableSlots([]); // Clear old slots immediately
    try {
      const dateStr = date.toISOString().split('T')[0];
      // Build URL with exclude_appointment_id to exclude the current appointment from availability check
      // IMPORTANT: Use the appointment's service_id to ensure consistent slot calculation
      // The backend validation will use the same service_id from the appointment, so we must match it
      // If service_id is null/undefined, don't pass it (backend will use null, which is consistent)
      const serviceId = appointment.service_id ? appointment.service_id : undefined;
      console.log(`[Frontend] Fetching slots - appointment.service_id: ${appointment.service_id}, using: ${serviceId}`);
      console.log(`[Frontend] Full appointment object:`, { 
        appointment_id: appointment.appointment_id,
        salon_id: appointment.salon_id,
        staff_id: appointment.staff_id,
        service_id: appointment.service_id,
        service_name: appointment.service_name
      });
      
      const baseUrl = API_ENDPOINTS.BOOKINGS.AVAILABLE_SLOTS(
        appointment.salon_id,
        appointment.staff_id,
        dateStr,
        serviceId
      );
      // Add exclude_appointment_id parameter
      const url = appointment.appointment_id 
        ? `${baseUrl}&exclude_appointment_id=${appointment.appointment_id}`
        : baseUrl;

      console.log(`[Frontend] Fetching available slots for date ${dateStr}, excluding appointment ${appointment.appointment_id}, service_id: ${serviceId}`);

      const res = await fetchWithRefresh(url, {
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.slots) {
        console.log(`[Frontend] Received ${data.slots.length} available slots:`, data.slots);
        setAvailableSlots(data.slots);
        // Clear selection if the previously selected slot is no longer available
        if (selectedTimeSlot && !data.slots.includes(selectedTimeSlot)) {
          console.log(`[Frontend] Previously selected slot ${selectedTimeSlot} is no longer available, clearing selection`);
          setSelectedTimeSlot(null);
        }
      } else {
        setAvailableSlots([]);
        console.error("Failed to fetch slots:", data.error);
      }
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (date && rescheduleAppointment) {
      fetchAvailableSlots(date, rescheduleAppointment);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleAppointmentId || !selectedDate || !selectedTimeSlot) {
      alert("Please select a date and available time slot.");
      return;
    }

    // Validate that the selected time slot is actually in the available slots list
    if (!availableSlots.includes(selectedTimeSlot)) {
      alert(`The selected time slot (${selectedTimeSlot}) is no longer available. Please select a different time.`);
      setSelectedTimeSlot(null);
      return;
    }

    setRescheduling(true);
    try {
      // Combine selected date and time slot
      const [hours, minutes] = selectedTimeSlot.split(':');
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const res = await fetchWithRefresh(
        API_ENDPOINTS.BOOKINGS.RESCHEDULE(rescheduleAppointmentId),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            new_scheduled_time: newDateTime.toISOString(),
          }),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Appointment rescheduled successfully!");
        setRescheduleAppointmentId(null);
        setRescheduleAppointment(null);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setAvailableSlots([]);
        loadHistory();
      } else {
        alert(data.error || "Failed to reschedule appointment.");
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      alert("Something went wrong while rescheduling appointment.");
    } finally {
      setRescheduling(false);
    }
  };

  const now = new Date();
  const displayedAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.scheduled_time);
    return filter === "upcoming" 
      ? appointmentDate >= now 
      : appointmentDate < now;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <p className="font-semibold mb-2">Error loading appointments:</p>
        <p>{error}</p>
        <button
          onClick={loadHistory}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No {filter} appointments
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {filter === "upcoming"
              ? "Book an appointment to see it here"
              : "Your past appointments will appear here"}
          </p>
          {filter === "upcoming" && (
            <button
              onClick={() => (window.location.href = "/customer")}
              className="mt-6 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold transition-colors"
            >
              Discover Salons
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAppointments.map((appointment) => {
            const isUpcoming = filter === "upcoming";
            const isCancelled = appointment.status.toLowerCase() === "cancelled";
            const canModify = isUpcoming && !isCancelled && appointment.status.toLowerCase() !== "completed";

            return (
              <div
                key={appointment.appointment_id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {appointment.salon_name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      with {appointment.staff_name}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(appointment.scheduled_time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(appointment.scheduled_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {appointment.service_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Service:</span>
                          <span>{appointment.service_name}</span>
                        </div>
                      )}
                    </div>

                    {canModify && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            // Clear all state first
                            setSelectedTimeSlot(null);
                            setAvailableSlots([]);
                            // Then set the appointment and date
                            setRescheduleAppointmentId(appointment.appointment_id);
                            setRescheduleAppointment(appointment);
                            const appointmentDate = new Date(appointment.scheduled_time);
                            setSelectedDate(appointmentDate);
                            // Fetch slots for the current date with exclude_appointment_id
                            // Use setTimeout to ensure state is cleared before fetching
                            setTimeout(() => {
                              fetchAvailableSlots(appointmentDate, appointment);
                            }, 0);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.appointment_id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleAppointmentId && rescheduleAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Reschedule Appointment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select New Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  inline
                  className="w-full"
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Available Time Slots
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading available slots...</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No available slots for this date. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot) => {
                        const [hours, minutes] = slot.split(':');
                        const time12 = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
                        const timeStr = time12.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        const isSelected = selectedTimeSlot === slot;

                        return (
                          <button
                            key={slot}
                            onClick={() => {
                              // Double-check the slot is still in the available list
                              if (availableSlots.includes(slot)) {
                                setSelectedTimeSlot(slot);
                              } else {
                                console.warn(`Slot ${slot} is not in available slots list`);
                                alert(`This time slot is no longer available. Please select another time.`);
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {timeStr}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedTimeSlot && (
                <div className={`p-3 border rounded-lg ${
                  availableSlots.includes(selectedTimeSlot)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm ${
                    availableSlots.includes(selectedTimeSlot)
                      ? 'text-blue-800'
                      : 'text-red-800'
                  }`}>
                    <span className="font-semibold">Selected:</span>{' '}
                    {selectedDate?.toLocaleDateString()} at{' '}
                    {(() => {
                      const [hours, minutes] = selectedTimeSlot.split(':');
                      const time12 = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
                      return time12.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    })()}
                    {!availableSlots.includes(selectedTimeSlot) && (
                      <span className="block mt-1 text-xs font-semibold">
                        ⚠️ This time slot is no longer available. Please select another time.
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setRescheduleAppointmentId(null);
                    setRescheduleAppointment(null);
                    setSelectedDate(null);
                    setSelectedTimeSlot(null);
                    setAvailableSlots([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={rescheduling}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={
                    rescheduling || 
                    !selectedDate || 
                    !selectedTimeSlot || 
                    (selectedTimeSlot && !availableSlots.includes(selectedTimeSlot))
                  }
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    selectedTimeSlot && !availableSlots.includes(selectedTimeSlot)
                      ? "Selected time slot is no longer available"
                      : undefined
                  }
                >
                  {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;

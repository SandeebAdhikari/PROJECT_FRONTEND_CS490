"use client";

import React, { useState, useEffect } from "react";
import { Clock, Save, X, Calendar, Trash2, Edit2, Loader2 } from "lucide-react";
import { getStaffAvailability, updateStaffAvailability, StaffAvailability } from "@/libs/api/staffPortal";
import { blockTimeSlot, getBlockedTimeSlots, updateBlockedTimeSlot, deleteBlockedTimeSlot, BlockedTimeSlot } from "@/libs/api/bookings";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const StaffPortalTabsAvailability: React.FC = () => {
  const [availability, setAvailability] = useState<StaffAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  
  // Edit state
  const [editingSlot, setEditingSlot] = useState<BlockedTimeSlot | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editReason, setEditReason] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadAvailability();
    loadBlockedSlots();
  }, []);

  const loadBlockedSlots = async () => {
    setLoadingBlocked(true);
    try {
      const result = await getBlockedTimeSlots();
      if (result.error) {
        console.error("Error loading blocked slots:", result.error);
        setBlockedSlots([]);
      } else {
        // Filter out past time slots on the frontend as well
        const now = new Date();
        const futureSlots = (result.blockedSlots || []).filter(
          (slot) => new Date(slot.end_datetime) > now
        );
        setBlockedSlots(futureSlots);
      }
    } catch (err) {
      console.error("Error loading blocked slots:", err);
      setBlockedSlots([]);
    } finally {
      setLoadingBlocked(false);
    }
  };

  const loadAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStaffAvailability();
      
      // Initialize with all days if empty
      if (data.availability.length === 0) {
        const defaultAvailability: StaffAvailability[] = daysOfWeek.map(day => ({
          day_of_week: day,
          start_time: "09:00",
          end_time: "17:00",
          is_available: day !== "Sunday", // Sunday off by default
        }));
        setAvailability(defaultAvailability);
      } else {
        // Fill in missing days
        const existingDays = new Set(data.availability.map(a => a.day_of_week));
        const missingDays = daysOfWeek.filter(day => !existingDays.has(day));
        const completeAvailability = [
          ...data.availability,
          ...missingDays.map(day => ({
            day_of_week: day,
            start_time: "09:00",
            end_time: "17:00",
            is_available: false,
          })),
        ].sort((a, b) => daysOfWeek.indexOf(a.day_of_week) - daysOfWeek.indexOf(b.day_of_week));
        setAvailability(completeAvailability);
      }
    } catch (err) {
      console.error("Error loading availability:", err);
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDay = (day: string, field: keyof StaffAvailability, value: string | boolean) => {
    setAvailability(prev =>
      prev.map(avail =>
        avail.day_of_week === day ? { ...avail, [field]: value } : avail
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateStaffAvailability(availability);
      // Update local state with the response from server to ensure consistency
      if (result.availability) {
        // Fill in missing days
        const existingDays = new Set(result.availability.map(a => a.day_of_week));
        const missingDays = daysOfWeek.filter(day => !existingDays.has(day));
        const completeAvailability = [
          ...result.availability,
          ...missingDays.map(day => ({
            day_of_week: day,
            start_time: "09:00",
            end_time: "17:00",
            is_available: false,
          })),
        ].sort((a, b) => daysOfWeek.indexOf(a.day_of_week) - daysOfWeek.indexOf(b.day_of_week));
        setAvailability(completeAvailability);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving availability:", err);
      setError(err instanceof Error ? err.message : "Failed to save availability");
      // Reload from server on error to get current state
      loadAvailability();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Your Availability</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Set your working hours for each day of the week
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Availability updated successfully!
        </div>
      )}

      <div className="space-y-3">
        {availability.map((avail) => (
          <div
            key={avail.day_of_week}
            className="flex items-center gap-4 p-4 border border-border rounded-lg bg-white"
          >
            <div className="w-24 font-semibold">{avail.day_of_week}</div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={avail.is_available}
                onChange={(e) =>
                  handleUpdateDay(avail.day_of_week, "is_available", e.target.checked)
                }
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm">Available</span>
            </label>

            {avail.is_available && (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="time"
                    value={avail.start_time}
                    onChange={(e) =>
                      handleUpdateDay(avail.day_of_week, "start_time", e.target.value)
                    }
                    className="px-3 py-1.5 border border-border rounded-lg text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={avail.end_time}
                    onChange={(e) =>
                      handleUpdateDay(avail.day_of_week, "end_time", e.target.value)
                    }
                    className="px-3 py-1.5 border border-border rounded-lg text-sm"
                  />
                </div>
              </>
            )}

            {!avail.is_available && (
              <span className="text-sm text-muted-foreground">Not available</span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 Tip</p>
        <p>
          Your availability determines when customers can book appointments with you.
          If you don't set availability for a day, the system will use the salon's business hours.
        </p>
      </div>

      {/* Block Time Slot Section */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold">Block Time Slots</h4>
            <p className="text-sm text-muted-foreground">
              Temporarily block specific time periods to prevent bookings
            </p>
          </div>
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
          >
            <X className="w-4 h-4" />
            Block Time
          </button>
        </div>

        {/* Display Blocked Time Slots */}
        {loadingBlocked ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading blocked slots...</span>
          </div>
        ) : blockedSlots.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No time slots blocked</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedSlots.map((slot) => {
              // Parse dates - handle both with and without Z suffix
              // If the datetime ends with Z, it's UTC; otherwise treat as local
              const parseLocalDate = (dateStr: string) => {
                if (dateStr.endsWith('Z')) {
                  // Remove Z and parse as local time (the database stores local time)
                  return new Date(dateStr.slice(0, -1));
                }
                return new Date(dateStr);
              };
              const startDate = parseLocalDate(slot.start_datetime);
              const endDate = parseLocalDate(slot.end_datetime);
              const isSameDay = startDate.toDateString() === endDate.toDateString();
              const isDeleting = deleting === slot.timeoff_id;
              
              return (
                <div
                  key={slot.timeoff_id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-white hover:bg-muted/50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">
                        {isSameDay
                          ? startDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {startDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {endDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {slot.reason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Reason: {slot.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSlot(slot);
                        // Format dates for datetime-local input (local timezone, not UTC)
                        const start = new Date(slot.start_datetime);
                        const end = new Date(slot.end_datetime);
                        const formatForInput = (d: Date) => {
                          const year = d.getFullYear();
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const day = String(d.getDate()).padStart(2, '0');
                          const hours = String(d.getHours()).padStart(2, '0');
                          const minutes = String(d.getMinutes()).padStart(2, '0');
                          return `${year}-${month}-${day}T${hours}:${minutes}`;
                        };
                        setEditStart(formatForInput(start));
                        setEditEnd(formatForInput(end));
                        setEditReason(slot.reason || "");
                      }}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Are you sure you want to delete this blocked time slot?")) {
                          return;
                        }
                        setDeleting(slot.timeoff_id);
                        setError(null);
                        try {
                          const result = await deleteBlockedTimeSlot(slot.timeoff_id);
                          if (result.error) {
                            setError(result.error);
                          } else {
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 3000);
                            await loadBlockedSlots();
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Failed to delete time slot");
                        } finally {
                          setDeleting(null);
                        }
                      }}
                      disabled={isDeleting}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition disabled:opacity-50"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Block Time Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-foreground">Block Time Slot</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={blockStart}
                onChange={(e) => setBlockStart(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={blockEnd}
                onChange={(e) => setBlockEnd(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                min={blockStart || new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason (Optional)
              </label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g., Personal time, Break"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!blockStart || !blockEnd) {
                    setError("Please select both start and end times");
                    return;
                  }
                  if (new Date(blockEnd) <= new Date(blockStart)) {
                    setError("End time must be after start time");
                    return;
                  }
                  setBlocking(true);
                  setError(null);
                  const result = await blockTimeSlot({
                    start_datetime: blockStart,
                    end_datetime: blockEnd,
                    reason: blockReason || undefined,
                  });
                  if (result.error) {
                    setError(result.error);
                  } else {
                    setShowBlockModal(false);
                    setBlockStart("");
                    setBlockEnd("");
                    setBlockReason("");
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                    // Reload blocked slots to show the new one
                    await loadBlockedSlots();
                  }
                  setBlocking(false);
                }}
                disabled={blocking || !blockStart || !blockEnd}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {blocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Blocking...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Block Time
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockStart("");
                  setBlockEnd("");
                  setBlockReason("");
                  setError(null);
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:bg-background transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Block Time Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-foreground">Edit Blocked Time Slot</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={editEnd}
                onChange={(e) => setEditEnd(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                min={editStart || new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason (Optional)
              </label>
              <input
                type="text"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g., Personal time, Break"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!editStart || !editEnd) {
                    setError("Please select both start and end times");
                    return;
                  }
                  if (new Date(editEnd) <= new Date(editStart)) {
                    setError("End time must be after start time");
                    return;
                  }
                  setUpdating(true);
                  setError(null);
                  try {
                    const result = await updateBlockedTimeSlot(editingSlot.timeoff_id, {
                      start_datetime: editStart,
                      end_datetime: editEnd,
                      reason: editReason.trim() || undefined,
                    });
                    if (result.error) {
                      setError(result.error);
                    } else {
                      setEditingSlot(null);
                      setEditStart("");
                      setEditEnd("");
                      setEditReason("");
                      setSuccess(true);
                      setTimeout(() => setSuccess(false), 3000);
                      await loadBlockedSlots();
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to update time slot");
                  } finally {
                    setUpdating(false);
                  }
                }}
                disabled={updating || !editStart || !editEnd}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setEditStart("");
                  setEditEnd("");
                  setEditReason("");
                  setError(null);
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:bg-background transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPortalTabsAvailability;


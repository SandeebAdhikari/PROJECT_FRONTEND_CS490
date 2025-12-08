"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Scissors, RefreshCw } from "lucide-react";
import { getBarberSchedule, BarberSchedule } from "@/libs/api/bookings";

const StaffPortalTabsSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<BarberSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBarberSchedule();
      if (result.error) {
        setError(result.error);
        setSchedule([]);
      } else {
        setSchedule(result.schedule || []);
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      setError("Failed to load schedule");
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
        <p>{error}</p>
        <button
          onClick={loadSchedule}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Daily Schedule</h3>
          <p className="text-sm text-muted-foreground">
            {schedule.length > 0 && schedule[0]?.scheduled_time
              ? formatDate(schedule[0].scheduled_time)
              : "Today's appointments"}
          </p>
        </div>
        <button
          onClick={loadSchedule}
          className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:bg-background transition-colors flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {schedule.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No appointments scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((appt) => (
            <div
              key={appt.appointment_id}
              className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {formatTime(appt.scheduled_time)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                      {appt.status}
                    </span>
                  </div>
                  {appt.customer_name && (
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{appt.customer_name}</span>
                    </div>
                  )}
                  {appt.service_name && (
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{appt.service_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPortalTabsSchedule;


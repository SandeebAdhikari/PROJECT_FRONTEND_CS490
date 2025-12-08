"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationsRead, Notification } from "@/libs/api/notifications";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter((n) => !n.read_status).length 
    : 0;

  useEffect(() => {
    // Only set up notifications if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, []);

  // Reload when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      // Check if user is authenticated before trying to load notifications
      const token = localStorage.getItem("token");
      if (!token) {
        // User not logged in, silently return empty notifications
        setNotifications([]);
        return;
      }

      const result = await getNotifications();
      if (result.error) {
        // Only log non-authentication errors
        if (result.error !== "Not authenticated" && result.error !== "Network error. Please try again.") {
          console.error("Error loading notifications:", result.error);
        }
        setNotifications([]);
        return;
      }
      if (result.notifications && Array.isArray(result.notifications)) {
        setNotifications(result.notifications);
      } else {
        setNotifications([]);
      }
    } catch {
      // Silently handle errors - don't spam console if user isn't authenticated
      setNotifications([]);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const result = await markNotificationRead(id);
      if (!result.error) {
        setNotifications((prev) =>
          prev.map((n) => (n.notification_id === id ? { ...n, read_status: true } : n))
        );
      } else {
        console.error("Error marking notification as read:", result.error);
      }
    } catch (error) {
      console.error("Error in handleMarkAsRead:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      const result = await markAllNotificationsRead();
      if (!result.error) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_status: true }))
        );
      } else {
        console.error("Error marking all as read:", result.error);
      }
    } catch (error) {
      console.error("Error in handleMarkAllAsRead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-full transition-smooth"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-destructive text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth disabled:opacity-50"
                >
                  {loading ? 'Marking...' : 'Mark all read'}
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!Array.isArray(notifications) || notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`p-4 border-b border-border hover:bg-muted cursor-pointer transition-smooth ${
                      !notification.read_status ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleMarkAsRead(notification.notification_id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.read_status ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read_status ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;


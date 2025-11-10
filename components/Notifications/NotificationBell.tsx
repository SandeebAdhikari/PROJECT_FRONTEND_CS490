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
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const result = await getNotifications();
    if (result.notifications && Array.isArray(result.notifications)) {
      setNotifications(result.notifications);
    } else {
      setNotifications([]);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, read_status: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    await markAllNotificationsRead();
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_status: true }))
    );
    setLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!Array.isArray(notifications) || notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read_status ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleMarkAsRead(notification.notification_id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.read_status ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
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


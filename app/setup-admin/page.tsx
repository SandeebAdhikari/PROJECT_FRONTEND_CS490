"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, fetchConfig } from "@/libs/api/config";
import { Shield, Mail, Lock, User, Phone } from "lucide-react";

export default function SetupAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    setup_token: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SETUP_ADMIN, {
        ...fetchConfig,
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to setup admin account");
      }

      // Store token and redirect
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("authToken", data.token);
      }

      setSuccess(true);
      // Redirect to admin portal after successful setup
      setTimeout(() => {
        router.push("/adminPortal/overview");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Setup Admin Account
          </h1>
          <p className="text-muted-foreground">
            Create the first admin account for the StyGo platform
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Admin Account Created!
            </h2>
            <p className="text-muted-foreground mb-4">
              Redirecting to admin portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                id="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Password *
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {process.env.NEXT_PUBLIC_ADMIN_SETUP_TOKEN && (
              <div>
                <label
                  htmlFor="setup_token"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Setup Token *
                </label>
                <input
                  id="setup_token"
                  type="password"
                  required
                  value={formData.setup_token}
                  onChange={(e) =>
                    setFormData({ ...formData, setup_token: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter setup token"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for security. Check your environment variables.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Admin Account...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Create Admin Account
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              This will create the first admin account. If an admin already
              exists, you&apos;ll need to use the setup token or contact support.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

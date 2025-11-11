"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSalon } from "@/libs/api/salons";
import { Building2, MapPin, Phone, Globe, Upload, Camera } from "lucide-react";

export default function RegisterSalonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    description: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "owner" && role !== "salon_owner") {
      router.push("/customer");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createSalon(formData, profilePicture);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      alert("Salon registered successfully! Redirecting to dashboard...");
      router.push("/admin/salon-dashboard/overview");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to register salon. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Salon
          </h1>
          <p className="text-gray-600">
            Get started by adding your salon information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Salon Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Salon Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Glamour Beauty Bar"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Picture (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setPreviewUrl("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {profilePicture?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <label className="cursor-pointer">
                      <span className="text-primary font-medium hover:underline">
                        Click to upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1234567890"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City (Optional)
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Los Angeles"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@yoursalon.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="www.yoursalon.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers about your salon..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register Salon"}
          </button>
        </form>
      </div>
    </div>
  );
}


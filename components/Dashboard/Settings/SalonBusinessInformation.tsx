"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Upload, Camera } from "lucide-react";
import { checkOwnerSalon } from "@/libs/api/salons";

const SalonBusinessInformation = () => {
  const [salonData, setSalonData] = useState({
    salon_id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    profile_picture: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.salon) {
          setSalonData({
            salon_id: result.salon.salon_id || "",
            name: result.salon.name || "",
            address: result.salon.address || "",
            phone: result.salon.phone || "",
            email: result.salon.email || "",
            website: result.salon.website || "",
            description: result.salon.description || "",
            profile_picture: result.salon.profile_picture || "",
          });
          if (result.salon.profile_picture) {
            setProfilePreview(`http://localhost:4000${result.salon.profile_picture}`);
          }
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, []);

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !salonData.salon_id) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("salon_id", salonData.salon_id.toString());

      const response = await fetch("http://localhost:4000/api/salons/profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfilePreview(`http://localhost:4000${result.profile_picture}`);
        setSalonData({ ...salonData, profile_picture: result.profile_picture });
        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-gray-500">Loading salon information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5" />
        <h2 className="text-lg font-bold">Business Information</h2>
      </div>

      <div className="space-y-4">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Salon profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <input
            type="text"
            title="Business name"
            placeholder="Enter business name"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            defaultValue={salonData.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            title="Business address"
            placeholder="Enter business address"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            rows={2}
            defaultValue={salonData.address}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            title="Business description"
            placeholder="Tell customers about your salon"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            rows={3}
            defaultValue={salonData.description}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              title="Business phone"
              placeholder="Enter phone number"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2"
              defaultValue={salonData.phone}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              title="Business email"
              placeholder="Enter email"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2"
              defaultValue={salonData.email}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            type="text"
            title="Business website"
            placeholder="Enter website URL"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            defaultValue={salonData.website}
          />
        </div>
      </div>
    </div>
  );
};

export default SalonBusinessInformation;

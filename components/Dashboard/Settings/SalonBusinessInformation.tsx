"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Upload, Camera, Save } from "lucide-react";
import Image from "next/image";
import { checkOwnerSalon, createSalon, updateSalon } from "@/libs/api/salons";

const SalonBusinessInformation = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [isNewSalon, setIsNewSalon] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    email: "",
    website: "",
    description: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const result = await checkOwnerSalon();
        if (result.hasSalon && result.salon) {
          setSalonId(result.salon.salon_id || null);
          setIsNewSalon(false);
          setFormData({
            name: result.salon.name || "",
            address: result.salon.address || "",
            phone: result.salon.phone || "",
            city: result.salon.city || "",
            email: result.salon.email || "",
            website: result.salon.website || "",
            description: result.salon.description || "",
          });
          if (result.salon.profile_picture) {
            setProfilePreview(`http://localhost:4000${result.salon.profile_picture}`);
          }
        } else {
          setIsNewSalon(true);
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setMessage({ type: 'error', text: 'Failed to load salon data' });
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.address || !formData.phone) {
      setMessage({ type: 'error', text: 'Name, address, and phone are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      let result;
      if (isNewSalon) {
        // Create new salon
        result = await createSalon(formData, profilePicture);
        if (result.salon) {
          setSalonId(result.salon.salon_id || null);
          setIsNewSalon(false);
        }
      } else if (salonId) {
        // Update existing salon
        result = await updateSalon(salonId, formData, profilePicture);
      }

      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: isNewSalon ? 'Salon created successfully!' : 'Salon updated successfully!' });
        // Clear profile picture file after successful save
        setProfilePicture(null);
      }
    } catch (error) {
      console.error("Error saving salon:", error);
      setMessage({ type: 'error', text: 'Failed to save salon information' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-muted-foreground">Loading salon information...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <h2 className="text-lg font-bold">
            {isNewSalon ? 'Setup Your Salon' : 'Business Information'}
          </h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-secondary text-foreground' : 'bg-destructive/10 text-destructive'}`}>
          {message.text}
        </div>
      )}

      {isNewSalon && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-foreground text-sm">
            <strong>Welcome!</strong> Let&apos;s set up your salon profile. Fill in the information below to get started.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {profilePreview ? (
                <Image
                  src={profilePreview}
                  alt="Salon profile"
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Camera className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-smooth">
                <Upload className="w-4 h-4" />
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Business Name <span className="text-destructive">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter business name"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address <span className="text-destructive">*</span></label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter business address"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter city"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell customers about your salon"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone <span className="text-destructive">*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://your-website.com"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default SalonBusinessInformation;

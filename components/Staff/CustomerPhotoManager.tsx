/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Check, Calendar, Trash2, Download, Info } from "lucide-react";
import Image from "next/image";
import {
  getUserPhotos,
  getPhotoUrl,
  ServicePhoto,
} from "@/libs/api/photos";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomerPhotoManagerProps {
  customerId: number; // user_id of the customer
  staffId?: number;
  salonId?: number; // salon_id for the visit
  onClose: () => void;
}

const CustomerPhotoManager: React.FC<CustomerPhotoManagerProps> = ({
  customerId,
  staffId,
  salonId,
  onClose,
}) => {
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<"before" | "after">("before");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, [customerId]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const result = await getUserPhotos(customerId, salonId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setPhotos(result.photos || []);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setPreviewFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!previewFile) {
      setError("Please select a photo");
      return;
    }
    if (!selectedDate) {
      setError("Please select a service date");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      // Try staff token first, then regular token
      const token = localStorage.getItem("staffToken") || 
                    localStorage.getItem("token") || 
                    localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("photo", previewFile);
      formData.append("user_id", customerId.toString());
      formData.append("photo_type", selectedType);
      
      // Add date for the photo (visit/service date)
      formData.append("visit_date", selectedDate.toISOString().split('T')[0]);
      
      if (salonId) {
        formData.append("salon_id", salonId.toString());
      }
      
      if (staffId) {
        formData.append("staff_id", staffId.toString());
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(
        `${API_BASE_URL}/api/photos/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(`${selectedType === "before" ? "Before" : "After"} photo uploaded successfully!`);
        setPreviewFile(null);
        setPreviewUrl("");
        fetchPhotos();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(result.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      const token = localStorage.getItem("staffToken") || 
                    localStorage.getItem("token") || 
                    localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(
        `${API_BASE_URL}/api/photos/service/${photoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessage("Photo deleted successfully");
        fetchPhotos();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const result = await response.json();
        setError(result.error || "Failed to delete photo");
      }
    } catch (err) {
      console.error("Error deleting photo:", err);
      setError("Network error. Please try again.");
    }
  };

  const handleDownload = (photoUrl: string, photoType: string) => {
    try {
      const url = getPhotoUrl(photoUrl);
      
      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const extension = photoUrl.split(".").pop()?.split("?")[0] || "jpg";
      const filename = `${photoType}-photo-${date}.${extension}`;
      
      // Use backend proxy to download (avoids CORS issues)
      const token = localStorage.getItem("staffToken");
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const proxyUrl = `${API_BASE_URL}/api/photos/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      // Create a hidden link and trigger download
      const link = document.createElement("a");
      link.href = proxyUrl;
      link.download = filename;
      
      // Add auth header via fetch for the download
      fetch(proxyUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((response) => {
          if (!response.ok) throw new Error("Download failed");
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          setMessage("Photo downloaded successfully!");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Download error:", err);
          // Fallback: open in new tab
          window.open(url, "_blank");
          setMessage("Photo opened in new tab. Right-click to save.");
          setTimeout(() => setMessage(""), 5000);
        });
    } catch (err) {
      console.error("Error downloading photo:", err);
      setError("Failed to download photo");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customer Photos</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {message && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" />
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading photos...</p>
            </div>
          ) : (
            <>
              {/* Existing Photos - Grouped by Date */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Photo History
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    <span>Hover photos to download or delete</span>
                  </div>
                </div>
                
                {/* Group photos by date */}
                {(() => {
                  // Group photos by date (using created_at or appointment scheduled_time)
                  const photoGroups = new Map<string, { before: ServicePhoto[]; after: ServicePhoto[] }>();
                  
                  photos.forEach((photo) => {
                    const dateKey = photo.appointment_id && (photo as any).scheduled_time
                      ? new Date((photo as any).scheduled_time).toLocaleDateString()
                      : new Date(photo.created_at).toLocaleDateString();
                    
                    if (!photoGroups.has(dateKey)) {
                      photoGroups.set(dateKey, { before: [], after: [] });
                    }
                    
                    const group = photoGroups.get(dateKey)!;
                    if (photo.photo_type === "before") {
                      group.before.push(photo);
                    } else {
                      group.after.push(photo);
                    }
                  });
                  
                  // Sort dates descending (most recent first)
                  const sortedDates = Array.from(photoGroups.keys()).sort((a, b) => {
                    return new Date(b).getTime() - new Date(a).getTime();
                  });
                  
                  if (sortedDates.length === 0) {
                    return (
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No photos yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add before and after photos to track transformations
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-6">
                      {sortedDates.map((dateKey) => {
                        const group = photoGroups.get(dateKey)!;
                        return (
                          <div key={dateKey} className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <h4 className="text-sm font-semibold text-foreground">{dateKey}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {/* Before Photos */}
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground mb-2">
                                  Before ({group.before.length})
                                </h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {group.before.length === 0 ? (
                                    <div className="col-span-2 border-2 border-dashed border-border rounded-lg p-3 text-center">
                                      <p className="text-xs text-muted-foreground">No before photos</p>
                                    </div>
                                  ) : (
                                    group.before.map((photo) => (
                                      <div
                                        key={photo.photo_id}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                                      >
                                        <Image
                                          src={getPhotoUrl(photo.photo_url)}
                                          alt="Before"
                                          fill
                                          className="object-cover"
                                        />
                                        {/* Photo action buttons */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                          <button
                                            onClick={() => handleDownload(photo.photo_url, "before")}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                            title="Download"
                                          >
                                            <Download className="w-4 h-4 text-gray-700" />
                                          </button>
                                          <button
                                            onClick={() => handleDelete(photo.photo_id)}
                                            className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              {/* After Photos */}
                              <div>
                                <h5 className="text-xs font-medium text-muted-foreground mb-2">
                                  After ({group.after.length})
                                </h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {group.after.length === 0 ? (
                                    <div className="col-span-2 border-2 border-dashed border-border rounded-lg p-3 text-center">
                                      <p className="text-xs text-muted-foreground">No after photos</p>
                                    </div>
                                  ) : (
                                    group.after.map((photo) => (
                                      <div
                                        key={photo.photo_id}
                                        className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                                      >
                                        <Image
                                          src={getPhotoUrl(photo.photo_url)}
                                          alt="After"
                                          fill
                                          className="object-cover"
                                        />
                                        {/* Photo action buttons */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                          <button
                                            onClick={() => handleDownload(photo.photo_url, "after")}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                            title="Download"
                                          >
                                            <Download className="w-4 h-4 text-gray-700" />
                                          </button>
                                          <button
                                            onClick={() => handleDelete(photo.photo_id)}
                                            className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Upload Section */}
              <div className="border-t border-border pt-6">
                <p className="text-sm font-medium mb-3">Add a new photo</p>

                {/* Date Picker */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Service Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="MMM d, yyyy"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    maxDate={new Date()}
                  />
                </div>

                {/* Photo Type Selector */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setSelectedType("before")}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === "before"
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setSelectedType("after")}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === "after"
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    After
                  </button>
                </div>

                {/* File Input */}
                <div className="mb-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                      {previewUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setPreviewFile(null);
                              setPreviewUrl("");
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload a {selectedType} photo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Upload Button */}
                {previewFile && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {uploading ? "Uploading..." : `Upload ${selectedType} Photo`}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPhotoManager;

"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import Header from "../Header";

interface Photo {
  photo_id: number;
  salon_id: number;
  photo_url: string;
  caption?: string;
  uploaded_at: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [salonId, setSalonId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSalonId(localStorage.getItem("salon_id"));
    }
  }, []);

  useEffect(() => {
    if (salonId) {
      fetchGallery(salonId);
    }
  }, [salonId]);

  const fetchGallery = async (currentSalonId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/photos/salon/${currentSalonId}`
      );
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection and create preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add photo to gallery
  const handleAddPhoto = async () => {
    if (!selectedFile || !salonId) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("salon_id", salonId);
      if (caption) {
        formData.append("caption", caption);
      }

      const response = await fetch("http://localhost:4000/api/photos/salon", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Reset form and close modal
        setSelectedFile(null);
        setCaption("");
        setPreviewUrl("");
        setShowAddModal(false);
        if (salonId) {
          fetchGallery(salonId);
        }
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add photo");
      }
    } catch (error) {
      console.error("Error adding photo:", error);
      alert("Error adding photo");
    } finally {
      setUploading(false);
    }
  };

  // Delete photo from gallery
  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/photos/salon/${photoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        if (salonId) {
          fetchGallery(salonId);
        }
      } else {
        alert("Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Error deleting photo");
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading gallery...</p>;
  }

  return (
    <section className="space-y-6 font-inter max-w-[1600px] mx-auto px-4 pb-8">
      <Header
        title="Gallery Management"
        subtitle="Manage your salon's photo gallery"
        onPrimaryClick={() => setShowAddModal(true)}
        primaryLabel="Add Photo"
        primaryIcon={Plus}
        showActions
      />
      {photos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-6">
            Your gallery is empty. Add your first photo to get started.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {photos.map((photo) => (
            <div
              key={photo.photo_id}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden group relative hover:shadow-lg hover:border-primary/30 transition-all duration-200"
            >
              <div className="relative aspect-square">
                <Image
                  src={`http://localhost:4000${photo.photo_url}`}
                  alt={photo.caption || "Gallery photo"}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleDeletePhoto(photo.photo_id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                {photo.caption && (
                  <p className="text-xs text-gray-700 font-medium truncate">
                    {photo.caption}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(photo.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Photo to Gallery</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                  {previewUrl ? (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={256}
                        height={256}
                        className="max-h-64 mx-auto rounded-lg object-contain"
                        unoptimized
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
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
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe this photo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFile(null);
                  setCaption("");
                  setPreviewUrl("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPhoto}
                disabled={uploading || !selectedFile}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Add Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;

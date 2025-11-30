"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Header from "../Header";
import { GalleryAPI } from "@/libs/api/gallery";

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
    if (salonId) fetchGallery(salonId);
  }, [salonId]);

  const fetchGallery = async (currentSalonId: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await GalleryAPI.list(currentSalonId, token);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedFile || !salonId) return;

    setUploading(true);

    try {
      const token = localStorage.getItem("token") || "";

      const response = await GalleryAPI.add(
        salonId,
        selectedFile,
        caption,
        token
      );

      if (response.ok) {
        setSelectedFile(null);
        setCaption("");
        setPreviewUrl("");
        setShowAddModal(false);
        fetchGallery(salonId);
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

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const token = localStorage.getItem("token") || "";
      const response = await GalleryAPI.delete(photoId, token);

      if (response.ok && salonId) fetchGallery(salonId);
      else alert("Failed to delete photo");
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Error deleting photo");
    }
  };

  if (loading) {
    return (
      <div className="font-inter space-y-6 p-6 sm:p-8">
        <Header
          title="Gallery Management"
          subtitle="Manage your salon's photo gallery"
          showActions={false}
        />
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-muted-foreground text-center">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter space-y-6 p-6 sm:p-8">
      <Header
        title="Gallery Management"
        subtitle="Manage your salon's photo gallery"
        onPrimaryClick={() => setShowAddModal(true)}
        primaryLabel="Add Photo"
        primaryIcon={Plus}
        showActions
      />

      {photos.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-6">
            Your gallery is empty. Add your first photo to get started.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth"
          >
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {photos.map((photo) => (
            <div
              key={photo.photo_id}
              className="bg-card border-2 border-border rounded-xl overflow-hidden group relative hover:shadow-lg hover:border-primary/30 transition-smooth"
            >
              <div className="relative aspect-square">
                <Image
                  src={GalleryAPI.imageUrl(photo.photo_url)}
                  alt={photo.caption || "Gallery photo"}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleDeletePhoto(photo.photo_id)}
                  className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-smooth shadow-lg hover:bg-destructive/90"
                  aria-label="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3">
                {photo.caption && (
                  <p className="text-xs text-foreground font-medium truncate">
                    {photo.caption}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(photo.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-foreground">Add Photo to Gallery</h3>
            
            {previewUrl && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary-dark transition-smooth"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFile(null);
                  setCaption("");
                  setPreviewUrl("");
                }}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPhoto}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

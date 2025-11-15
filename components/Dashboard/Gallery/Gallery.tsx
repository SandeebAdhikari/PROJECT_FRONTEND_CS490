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
  const [_showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [_previewUrl, setPreviewUrl] = useState("");
  const [_uploading, setUploading] = useState(false);
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

  const _handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const _handleAddPhoto = async () => {
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

  if (loading) return <p className="text-center mt-6">Loading gallery...</p>;

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
                  src={GalleryAPI.imageUrl(photo.photo_url)}
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

      {/* Modal omitted for brevity (you can keep your existing UI) */}
    </section>
  );
};

export default Gallery;

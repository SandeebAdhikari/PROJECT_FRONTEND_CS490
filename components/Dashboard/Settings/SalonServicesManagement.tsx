"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Scissors } from "lucide-react";

interface Service {
  service_id: number;
  custom_name: string;
  category_name: string;
  duration: number;
  price: number;
  is_active: boolean;
}

const SalonServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Haircuts",
    duration: 30,
    price: 0,
  });
  const [salonId, setSalonId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSalonId(localStorage.getItem("salon_id"));
    }
  }, []);

  const categories = [
    "Haircuts",
    "Hair Coloring",
    "Nails",
    "Skincare",
    "Makeup",
    "Spa",
    "Eyebrows",
  ];

  useEffect(() => {
    if (salonId) {
      fetchServices(salonId);
    }
  }, [salonId]);

  // Fetch services from backend
  const fetchServices = async (currentSalonId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/salons/${currentSalonId}/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add or update service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const url = editingService
        ? `http://localhost:4000/api/services/${editingService.service_id}`
        : `http://localhost:4000/api/services`;

      const response = await fetch(url, {
        method: editingService ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          salon_id: salonId,
          custom_name: formData.name,
          category: formData.category,
          duration: formData.duration,
          price: formData.price,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingService(null);
        setFormData({ name: "", category: "Haircuts", duration: 30, price: 0 });
        if (salonId) {
          fetchServices(salonId);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    }
  };

  // Edit service
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.custom_name,
      category: service.category_name,
      duration: service.duration,
      price: service.price,
    });
    setShowModal(true);
  };

  // Delete service
  const handleDelete = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/services/${serviceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        if (salonId) {
          fetchServices(salonId);
        }
      } else {
        alert("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  // Open modal to add new service
  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: "", category: "Haircuts", duration: 30, price: 0 });
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading services...</div>;
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5" />
          <h2 className="text-lg font-bold">Services</h2>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No services yet. Add your first service to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.service_id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{service.custom_name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {service.category_name}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                  <span>{service.duration} min</span>
                  <span className="font-semibold text-primary">
                    ${service.price}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.service_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Haircut"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) })
                  }
                  required
                  min="5"
                  step="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  {editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonServicesManagement;

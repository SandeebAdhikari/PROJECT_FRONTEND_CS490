"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonId: number;
  salonSlug: string;
  onAdded?: () => void;
}

interface RoleOption {
  staff_role_id: number;
  staff_role_name: string;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  salonId,
  salonSlug,
  onAdded,
}) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    staff_role: "",
    staff_role_id: "",
    specialization: [] as string[],
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch available staff roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/api/staff/roles?salon_id=${salonId}`
        );
        const data = await res.json();
        if (res.ok) setRoles(data.roles || []);
      } catch (err) {
        console.error("Error loading roles:", err);
      }
    };
    if (isOpen && salonId) loadRoles();
  }, [isOpen, salonId]);

  if (!isOpen) return null;

  // handle normal text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle checkbox specializations
  const handleSpecializationToggle = (specialty: string) => {
    setForm((prev) => {
      const exists = prev.specialization.includes(specialty);
      return {
        ...prev,
        specialization: exists
          ? prev.specialization.filter((s) => s !== specialty)
          : [...prev.specialization, specialty],
      };
    });
  };

  // handle adding a new role
  const handleAddNewRole = async () => {
    if (!newRole.trim()) return;
    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/roles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ salon_id: salonId, staff_role_name: newRole }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setRoles((prev) => [...prev, data.role]);
        setForm({
          ...form,
          staff_role: newRole,
          staff_role_id: data.role.staff_role_id,
        });
        setNewRole("");
      } else {
        setMessage(data.error || "Failed to add role");
      }
    } catch (err) {
      console.error("Add role error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetchWithRefresh(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/staff`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            salon_id: salonId,
            salon_slug: salonSlug,
            staff_role: form.staff_role,
            staff_role_id: form.staff_role_id || null,
            specialization: form.specialization.join(", "),
            email: form.email,
            full_name: form.full_name,
            phone: form.phone,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(" Staff added & onboarding email sent!");
        onAdded?.();
        setForm({
          full_name: "",
          email: "",
          phone: "",
          staff_role: "",
          staff_role_id: "",
          specialization: [],
        });
      } else {
        setMessage(` ${data.error || "Failed to add staff"}`);
      }
    } catch (err) {
      console.error("Add staff error:", err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  // sample specializations (reused from services UI)
  const specialties = [
    "Haircut",
    "Color",
    "Styling",
    "Nails",
    "Facial",
    "Massage",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Staff Member</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-3 py-2"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-3 py-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          {/* staff role dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Staff Role
            </label>
            <div className="flex gap-2 mt-1">
              <select
                name="staff_role_id"
                value={form.staff_role_id}
                onChange={(e) => {
                  const selected = roles.find(
                    (r) => r.staff_role_id === Number(e.target.value)
                  );
                  setForm({
                    ...form,
                    staff_role_id: e.target.value,
                    staff_role: selected ? selected.staff_role_name : "",
                  });
                }}
                className="w-full border border-border rounded-lg px-3 py-2 bg-white"
                aria-label="Select staff role"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.staff_role_id} value={r.staff_role_id}>
                    {r.staff_role_name}
                  </option>
                ))}
              </select>
            </div>

            {/* add new role */}
            <div className="flex mt-2 gap-2">
              <input
                placeholder="Add new role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="flex-1 border border-border rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={handleAddNewRole}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* specialization checkboxes */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Specializations
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.map((sp) => (
                <label
                  key={sp}
                  className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer ${
                    form.specialization.includes(sp)
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                      : "bg-white border-border text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.specialization.includes(sp)}
                    onChange={() => handleSpecializationToggle(sp)}
                    className="hidden"
                  />
                  {sp}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Staff"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-3 text-sm ${
              message.startsWith("_") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddStaffModal;

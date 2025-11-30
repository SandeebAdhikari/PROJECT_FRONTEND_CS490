"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { StaffMember } from "@/components/Dashboard/Staff/Staffcard";
import { fetchWithRefresh } from "@/libs/api/fetchWithRefresh";
import { API_ENDPOINTS } from "@/libs/api/config";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember;
  salonId: number;
  onUpdated?: () => void;
}
interface RoleOption {
  staff_role_id: number;
  staff_role_name: string;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({
  isOpen,
  onClose,
  staff,
  salonId,
  onUpdated,
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (staff && isOpen) {
      setForm({
        full_name: staff.full_name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        staff_role: staff.staff_role || "",
        staff_role_id: staff.staff_role_id?.toString() || "",
        specialization: staff.specialization
          ? staff.specialization.split(",").map((s: string) => s.trim())
          : [],
      });
    }
  }, [staff, isOpen]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await fetchWithRefresh(
          API_ENDPOINTS.STAFF.ROLES(salonId),
          { credentials: "include" }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetchWithRefresh(
        API_ENDPOINTS.STAFF.UPDATE(staff.staff_id),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            salon_id: salonId,
            user_id: staff.user_id,
            staff_role: form.staff_role,
            staff_role_id: form.staff_role_id,
            specialization: form.specialization.join(", "),
            full_name: form.full_name,
            phone: form.phone,
            email: form.email,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Staff updated successfully!");
        onUpdated?.();
        onClose();
      } else {
        setMessage(data.error || "Failed to update staff");
      }
    } catch (err) {
      console.error("Edit staff error:", err);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    "Haircut",
    "Color",
    "Styling",
    "Nails",
    "Facial",
    "Massage",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-inter">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Staff Member</h2>

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
            className="w-full border border-border rounded-lg px-3 py-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          <div>
            <label className="text-sm font-medium text-gray-700">
              Staff Role
            </label>
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
              aria-label="Staff Role"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.staff_role_id} value={r.staff_role_id}>
                  {r.staff_role_name}
                </option>
              ))}
            </select>
          </div>

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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-3 text-sm ${
              message.startsWith("Staff updated")
                ? "text-primary-light"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditStaffModal;

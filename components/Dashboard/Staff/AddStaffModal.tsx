"use client";

import React, { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";
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
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    staff_role: "",
    staff_role_id: "",
    specialization: [] as string[],
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        setAddingRole(false);
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

    const full_name =
      `${form.first_name.trim()} ${form.last_name.trim()}`.trim();

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
            full_name,
            phone: form.phone,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Staff added & onboarding email sent!");
        onAdded?.();
        setForm({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          staff_role: "",
          staff_role_id: "",
          specialization: [],
        });
      } else {
        setMessage(`❌ ${data.error || "Failed to add staff"}`);
      }
    } catch (err) {
      console.error("Add staff error:", err);
      setMessage("❌ Server error");
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

        <h2 className="text-xl font-bold mb-4">Add New Staff Member</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* name fields */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="border border-border rounded-lg px-3 py-2"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="border border-border rounded-lg px-3 py-2"
            />
          </div>

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

          {/* staff role */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Staff Role <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
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
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.staff_role_id} value={r.staff_role_id}>
                    {r.staff_role_name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setAddingRole((prev) => !prev)}
                className="p-2 rounded-lg border border-border hover:bg-accent"
              >
                <PlusCircle className="h-5 w-5 text-emerald-600" />
              </button>
            </div>

            {addingRole && (
              <div className="flex mt-3 gap-2">
                <input
                  placeholder="New role name"
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
            )}
          </div>

          {/* specializations */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Specializations <span className="text-red-500">*</span>
            </label>
            <div className="border border-border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
              {specialties.map((sp) => {
                const checked = form.specialization.includes(sp);
                return (
                  <label
                    key={sp}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleSpecializationToggle(sp)}
                      className="accent-emerald-600"
                    />
                    <span>{sp}</span>
                  </label>
                );
              })}
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
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
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

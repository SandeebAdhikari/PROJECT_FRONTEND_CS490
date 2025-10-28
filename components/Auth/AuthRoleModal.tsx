"use client";

import React, { useState } from "react";

interface AuthRoleModalProps {
  onSelectRole: (role: string, businessName?: string) => void;
  onCancel: () => void;
}

const RoleModal: React.FC<AuthRoleModalProps> = ({
  onSelectRole,
  onCancel,
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");

  const handleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === "owner" && !businessName.trim()) {
      alert("Please enter your business name");
      return;
    }
    onSelectRole(selectedRole, businessName.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[320px] flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-center text-foreground">
          Select Your Role
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-2">
          Please choose your role before continuing.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => setSelectedRole("owner")}
            className={`border rounded-lg py-2 font-medium hover:bg-primary hover:text-white transition ${
              selectedRole === "owner" ? "bg-primary text-white" : ""
            }`}
          >
            Salon Owner
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("customer")}
            className={`border rounded-lg py-2 font-medium hover:bg-primary hover:text-white transition ${
              selectedRole === "customer" ? "bg-primary text-white" : ""
            }`}
          >
            Customer
          </button>
        </div>

        {selectedRole === "owner" && (
          <div className="w-full mt-2">
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your salon name"
              className="w-full border border-border rounded-md p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        )}

        <div className="flex justify-between gap-3 mt-4 w-full">
          <button
            onClick={onCancel}
            className="w-1/2 border rounded-lg py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={
              !selectedRole ||
              (selectedRole === "owner" && !businessName.trim())
            }
            className="w-1/2 bg-primary text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;

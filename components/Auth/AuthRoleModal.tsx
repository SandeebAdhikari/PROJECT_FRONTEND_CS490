"use client";

import React, { useState } from "react";

interface AuthRoleModalProps {
  onSelectRole: (role: string) => void;
  onCancel: () => void;
}

const RoleModal: React.FC<AuthRoleModalProps> = ({
  onSelectRole,
  onCancel,
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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
            onClick={() => setSelectedRole("owner")}
            className={`border rounded-lg py-2 font-medium hover:bg-primary hover:text-white transition ${
              selectedRole === "owner" ? "bg-primary text-white" : ""
            }`}
          >
            Salon Owner
          </button>

          <button
            onClick={() => setSelectedRole("customer")}
            className={`border rounded-lg py-2 font-medium hover:bg-primary hover:text-white transition ${
              selectedRole === "customer" ? "bg-primary text-white" : ""
            }`}
          >
            Customer
          </button>
        </div>

        <div className="flex justify-between gap-3 mt-4 w-full">
          <button
            onClick={onCancel}
            className="w-1/2 border rounded-lg py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedRole && onSelectRole(selectedRole)}
            disabled={!selectedRole}
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

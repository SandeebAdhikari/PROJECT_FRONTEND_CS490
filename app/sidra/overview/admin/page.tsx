"use client";

import { Mail, Lock, User, Bell, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-8">

      <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
      <p className="text-muted-foreground">
        Manage your account details, preferences, and security.
      </p>

      {/* PROFILE CARD */}
      <div className="bg-secondary border border-border rounded-2xl shadow-soft p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User size={20} /> Profile Information
        </h2>

        <div className="space-y-2 text-muted-foreground">
          <p><strong className="text-foreground">Name:</strong> Sara Smith</p>
          <p><strong className="text-foreground">Email:</strong> sara@example.com</p>
          <p><strong className="text-foreground">Role:</strong> Platform Administrator</p>
        </div>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-soft hover:bg-primary-light transition-smooth">
          Edit Profile
        </button>
      </div>

      {/* PASSWORD CARD */}
      <div className="bg-secondary border border-border rounded-2xl shadow-soft p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lock size={20} /> Change Password
        </h2>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-soft hover:bg-primary-light transition-smooth">
          Update Password
        </button>
      </div>

      {/* NOTIFICATION SETTINGS */}
      <div className="bg-secondary border border-border rounded-2xl shadow-soft p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell size={20} /> Notification Preferences
        </h2>

        <ul className="space-y-2 text-muted-foreground">
          <li>• New salon approval requests</li>
          <li>• System warnings</li>
          <li>• Customer reports</li>
        </ul>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-soft hover:bg-primary-light transition-smooth">
          Edit Notifications
        </button>
      </div>

      {/* SECURITY CARD */}
      <div className="bg-secondary border border-border rounded-2xl shadow-soft p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShieldCheck size={20} /> Security
        </h2>

        <p className="text-muted-foreground">
          Manage 2FA, login devices, and account protections.
        </p>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-soft hover:bg-primary-light transition-smooth">
          Manage Security
        </button>
      </div>
    </div>
  );
}

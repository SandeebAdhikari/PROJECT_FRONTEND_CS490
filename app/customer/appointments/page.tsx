"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, ArrowLeft } from "lucide-react";

export default function CustomerAppointmentsLanding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-card border border-border rounded-xl shadow p-6 space-y-4">
        <button
          onClick={() => router.push("/customer")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customer Home
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Your Appointments
            </h1>
            <p className="text-sm text-muted-foreground">
              Use the email links to view a specific appointment, or head to
              your profile to see your history.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push("/customer/my-profile")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to My Profile
          </button>
          <button
            onClick={() => router.push("/customer")}
            className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:bg-background transition-colors"
          >
            Browse Salons
          </button>
        </div>
      </div>
    </div>
  );
}

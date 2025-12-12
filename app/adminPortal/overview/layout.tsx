"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Admin/Sidebar";
import { jwtDecode } from "jwt-decode";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("authToken");

        if (!token) {
          router.push("/sign-in");
          return;
        }

        // Decode JWT to check role
        const decoded = jwtDecode(token) as {
          role?: string;
          user_role?: string;
        };
        const userRole = decoded.role || decoded.user_role;

        if (userRole !== "admin") {
          // Not an admin, redirect to appropriate page
          if (userRole === "owner") {
            router.push("/salonPortal/salon-dashboard");
          } else {
            router.push("/customer");
          }
          return;
        }

        // User is admin, allow access
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen bg-background ">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-auto ">{children}</main>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ArrowLeft, Chrome, Facebook } from "lucide-react";
//import { signInWithPopup, type AuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import RoleModal from "@/components/Auth/AuthRoleModal";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setAuthCookie } from "@/libs/auth/cookies";
import { API_ENDPOINTS } from "@/libs/api/config";
import {
  auth,
  googleProvider,
  facebookProvider,
  microsoftProvider,
} from "@/libs/firebase/client";
import NextImage from "next/image";
import Icon9 from "@/public/icons/9.png";
interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pendingUser, setPendingUser] = useState<{
    firebaseUid: string;
    email: string;
    fullName?: string | null;
    profilePic?: string | null;
    phone?: string | null;
  } | null>(null);

  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const handleFirebaseLogin = async (provider: GoogleAuthProvider) => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch(
        API_ENDPOINTS.AUTH.VERIFY_FIREBASE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Firebase login failed");

      if (data.existingUser && data.token && data.role) {
        setAuthCookie(data.token);
        const role = data.role.toLowerCase();
        if (role === "admin") {
          window.location.href = "/adminPortal/overview";
        } else if (role === "owner") {
          window.location.href = "/salonPortal/salon-dashboard/overview";
        } else {
          window.location.href = "/customer";
        }
      } else if (data.newUser && data.firebaseUid && data.email) {
        const current = auth.currentUser;
        setPendingUser({
          firebaseUid: data.firebaseUid,
          email: data.email,
          fullName: current?.displayName || "Unknown User",
          profilePic: current?.photoURL || null,
          phone: current?.phoneNumber || null,
        });
        setShowRoleModal(true);
      } else {
        throw new Error("Unexpected backend response");
      }
    } catch (err: unknown) {
      // ignore harmless cancellations
      if (err && typeof err === "object" && "code" in err) {
        if (err.code === "auth/cancelled-popup-request") {
          return;
        }
        if (err.code === "auth/popup-closed-by-user") {
          return;
        }
      }

      console.error("Login failed:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert("Social login failed: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: string, businessName?: string) => {
    if (!pendingUser) return;
    setShowRoleModal(false);

    try {
      const res: Response = await fetch(
        API_ENDPOINTS.AUTH.SET_ROLE,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: pendingUser.firebaseUid,
            email: pendingUser.email,
            fullName: pendingUser.fullName,
            profilePic: pendingUser.profilePic,
            phone: pendingUser.phone,
            role,
            businessName,
          }),
        }
      );

      const data: { token?: string; role?: string; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set role");

      setAuthCookie(data.token || "");
      const userRole = data.role?.toLowerCase();
      if (userRole === "admin") {
        window.location.href = "/adminPortal/overview";
      } else if (userRole === "owner") {
        window.location.href = "/salonPortal/salon-dashboard/overview";
      } else {
        window.location.href = "/customer";
      }
    } catch (err) {
      console.error(err);
      alert("Failed to assign role");
    }
  };

  return (
    <>
      {showRoleModal && (
        <RoleModal
          onSelectRole={handleRoleSelect}
          onCancel={() => setShowRoleModal(false)}
        />
      )}

      <button
        onClick={handleBack}
        type="button"
        className="flex justify-center items-center gap-2 text-muted-foreground font-inter cursor-pointer hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="flex flex-col items-center">
        <NextImage src={Icon9} alt="app-icon" width={45} height={45} />
        <h2 className="text-2xl mt-[16px] font-bold text-foreground">StyGo</h2>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground font-inter">{subtitle}</p>
      </div>

      <div className="flex flex-col items-center font-inter font-semibold w-full">
        <button
          type="button"
          className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer"
          onClick={() => handleFirebaseLogin(googleProvider)}
        >
          <Chrome className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer"
          onClick={() => handleFirebaseLogin(microsoftProvider)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 2h9v9H2zM13 2h9v9h-9zM2 13h9v9H2zM13 13h9v9h-9z" />
          </svg>
          <span>Continue with Microsoft</span>
        </button>

        <button
          type="button"
          className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer"
          onClick={() => handleFirebaseLogin(facebookProvider)}
        >
          <Facebook className="w-4 h-4" />
          <span>Continue with Facebook</span>
        </button>
      </div>

      <div className="flex items-center gap-2 w-full">
        <hr className="flex-grow border-border" />
        <span className="text-xs font-inter text-muted-foreground">
          OR CONTINUE WITH EMAIL
        </span>
        <hr className="flex-grow border-border" />
      </div>
    </>
  );
};

export default AuthHeader;

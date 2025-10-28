"use client";

import React, { useState } from "react";
import { ArrowLeft, Chrome, Facebook } from "lucide-react";
import { signInWithPopup, type AuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import RoleModal from "@/components/Auth/AuthRoleModal";
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

  const handleFirebaseLogin = async (provider: AuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-firebase`,
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
        document.cookie = `token=${data.token}; path=/; max-age=3600;`;
        window.location.href =
          data.role === "owner"
            ? "/admin/salon-dashboard/overview"
            : "/customer";
        return;
      }

      if (data.newUser && data.firebaseUid && data.email) {
        const user = auth.currentUser;

        setPendingUser({
          firebaseUid: data.firebaseUid,
          email: data.email,
          fullName: user?.displayName || "Unknown User",
          profilePic: user?.photoURL || null,
          phone: user?.phoneNumber || null,
        });

        setShowRoleModal(true);
        return;
      }

      throw new Error("Unexpected backend response");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "An unknown error occurred";
      alert("Social login failed: " + message);
    }
  };

  const handleRoleSelect = async (role: string, businessName?: string) => {
    if (!pendingUser) return;
    setShowRoleModal(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-role`,
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set role");

      document.cookie = `token=${data.token}; path=/; max-age=3600;`;
      window.location.href =
        data.role === "owner" ? "/admin/salon-dashboard/overview" : "/customer";
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

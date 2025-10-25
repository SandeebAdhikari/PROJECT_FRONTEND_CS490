"use client";

import { ArrowLeft, Scissors, Chrome, Facebook } from "lucide-react";
import { signInWithPopup, type AuthProvider } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
} from "@/libs/firebase/client";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, onBack }) => {
  const handleFirebaseLogin = async (
    provider: AuthProvider,
    providerName: string
  ) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send to your backend for Firebase verification + JWT creation
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-firebase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, provider: providerName }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Firebase login failed");

      localStorage.setItem("token", data.token);
      window.location.href =
        data.role === "salon_owner"
          ? "/SalonDashboard/owner"
          : "/SalonDashboard/customer";
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
  return (
    <>
      <button
        onClick={onBack}
        type="button"
        className="flex justify-center items-center gap-2 text-muted-foreground font-inter cursor-pointer hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-[48px] h-[48px] rounded-xl bg-primary">
          <Scissors className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-2xl mt-[16px] font-bold text-foreground">StyGo</h2>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground font-inter">{subtitle}</p>
      </div>

      <div className="flex flex-col items-center font-inter font-bold">
        <button
          className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer"
          onClick={() => handleFirebaseLogin(googleProvider, "google")}
        >
          <Chrome className="w-4 h-4" />
          <span> Continue with Google</span>
        </button>
        <button
          className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer"
          onClick={() => handleFirebaseLogin(appleProvider, "apple")}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 2h9v9H2zM13 2h9v9h-9zM2 13h9v9H2zM13 13h9v9h-9z" />
          </svg>
          Continue with Microsoft
        </button>
        <button
          className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer"
          onClick={() => handleFirebaseLogin(facebookProvider, "facebook")}
        >
          <Facebook className="w-4 h-4" />
          <span> Continue with Facebook</span>
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

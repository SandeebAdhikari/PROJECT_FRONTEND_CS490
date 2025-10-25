"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/libs/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

const AuthContext = createContext<{ loading: boolean }>({ loading: true });

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => setLoading(false));
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Image
          src="/icons/6.png"
          alt="StyGo Logo"
          width={80}
          height={80}
          priority
          className="animate-pulse"
        />

        <h2 className="text-xl font-bold text-foreground">StyGo</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Checking your session...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthLoading = () => useContext(AuthContext);

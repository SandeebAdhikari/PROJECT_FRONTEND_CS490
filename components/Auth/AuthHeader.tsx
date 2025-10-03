"use client";

import React from "react";
import { ArrowLeft, Scissors, Chrome, Facebook } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, onBack }) => {
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
        <h2 className="text-2xl mt-[16px] font-bold text-foreground">
          SalonBooker
        </h2>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground font-inter">{subtitle}</p>
      </div>

      <div className="flex flex-col items-center font-inter font-bold">
        <button className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer">
          <Chrome className="w-4 h-4" />
          <span> Continue with Google</span>
        </button>
        <button className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
          </svg>
          Continue with Apple
        </button>
        <button className="mt-4 flex gap-4 items-center justify-center shadow-medium p-3 w-full rounded-xl hover:bg-accent cursor-pointer">
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

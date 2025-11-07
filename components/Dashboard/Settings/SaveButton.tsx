"use client";

import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick?: () => void;
  label?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  label = "Save Settings",
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-emerald-400/40 cursor-pointer"
    >
      <Save className="w-5 h-5" />
      {label}
    </button>
  );
};

export default SaveButton;

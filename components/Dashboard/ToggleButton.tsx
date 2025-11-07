"use client";

import React from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ checked = false, onChange }) => {
  return (
    <button
      aria-label={checked ? "Turn off" : "Turn on"}
      title={checked ? "Turn off" : "Turn on"}
      onClick={() => onChange?.(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
        checked ? "bg-emerald-500" : "bg-gray-300 "
      }`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleButton;

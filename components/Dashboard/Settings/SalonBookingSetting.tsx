"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import ToggleButton from "../ToggleButton";
const SalonBookingSettings = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        <h2 className="text-lg font-bold">Booking Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Advance Booking (Days)
          </label>
          <input
            type="number"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            defaultValue={30}
            placeholder="Enter number of days"
            title="Advance Booking (Days)"
          />
        </div>

        <div>
          <label
            htmlFor="cancellationPolicy"
            className="block text-sm font-medium"
          >
            Cancellation Policy
          </label>
          <textarea
            id="cancellationPolicy"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            rows={2}
            defaultValue="24 hours notice required for cancellations"
            placeholder="Enter cancellation policy"
            title="Cancellation Policy"
            aria-label="Cancellation Policy"
          />
        </div>

        <div className="sm:flex items-center justify-between">
          <div className="flex justify-between items-center">
            <div>
              <p id="require-deposit-label" className="font-medium">
                Require Deposit
              </p>
              <p className="text-sm text-gray-500">
                Require customers to pay a deposit
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ToggleButton checked={enabled} onChange={setEnabled} />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium">
              Deposit Amount ($)
            </label>
            <input
              type="number"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2"
              defaultValue={25}
              placeholder="Enter deposit amount"
              title="Deposit Amount"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonBookingSettings;

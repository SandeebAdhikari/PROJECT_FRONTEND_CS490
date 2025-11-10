"use client";

import React from "react";
import { MapPin } from "lucide-react";

const SalonBusinessInformation = () => {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5" />
        <h2 className="text-lg font-bold">Business Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <input
            type="text"
            title="Business name"
            placeholder="Luxe Hair Studio"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            defaultValue="Luxe Hair Studio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            title="Business address"
            placeholder="123 Beauty Boulevard, Fashion District, CA 90210"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            rows={2}
            defaultValue="123 Beauty Boulevard, Fashion District, CA 90210"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              title="Business phone"
              placeholder="+1 (555) LUXE-HAIR"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2"
              defaultValue="+1 (555) LUXE-HAIR"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              title="Business email"
              placeholder="info@luxehair.com"
              className="w-full mt-1 rounded-lg border border-border px-3 py-2"
              defaultValue="info@luxehair.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Website</label>
          <input
            type="text"
            title="Business website"
            placeholder="www.luxehair.com"
            className="w-full mt-1 rounded-lg border border-border px-3 py-2"
            defaultValue="www.luxehair.com"
          />
        </div>
      </div>
    </div>
  );
};

export default SalonBusinessInformation;

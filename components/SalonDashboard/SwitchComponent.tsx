import React from "react";
import data from "@/data/data.json" assert { type: "json" };
import { SwitchComponentItem } from "@/libs/dashboard/dashboard.types";

const SwitchComponent = () => {
  const typedData = data.menu as SwitchComponentItem[];
  return (
    <div className="p-4 sm:p-8 ">
      <div className="border border-border bg-secondary">
        <div className="grid-cols-3 sm:grid"></div>
      </div>
    </div>
  );
};

export default SwitchComponent;

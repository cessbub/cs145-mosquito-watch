
import React from "react";
import { CircleSlash, Wrench } from "lucide-react";

const MapLegend = () => {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-end gap-4 text-sm">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-status-safe"></div>
        <span>Low Risk</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-status-warning"></div>
        <span>Medium Risk</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-status-danger"></div>
        <span>High Risk</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        <span>Inactive</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span>Maintenance</span>
      </div>
    </div>
  );
};

export default MapLegend;

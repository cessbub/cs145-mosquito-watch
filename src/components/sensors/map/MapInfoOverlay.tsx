
import React from "react";

interface MapInfoOverlayProps {
  activeSensorsCount: number;
  highRiskSensorsCount: number;
}

const MapInfoOverlay = ({ activeSensorsCount, highRiskSensorsCount }: MapInfoOverlayProps) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-md max-w-xs">
      <h3 className="text-sm font-medium mb-1">UP Diliman Sensor Network</h3>
      <p className="text-xs text-gray-600 mb-2">
        Displaying {activeSensorsCount} active sensors with {highRiskSensorsCount} high-risk locations
      </p>
      <div className="flex items-center justify-end gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-status-safe"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-status-warning"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-status-danger"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default MapInfoOverlay;

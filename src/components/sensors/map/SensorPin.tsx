
import React from "react";
import { cn } from "@/lib/utils";
import { MapPin, CircleSlash, Wrench } from "lucide-react";

type SensorMapLocation = {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: "active" | "inactive" | "maintenance";
  mosquitoLevel: "low" | "medium" | "high";
};

interface SensorPinProps {
  sensor: SensorMapLocation;
  sensorId: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

const SensorPin = ({ sensor, sensorId, position }: SensorPinProps) => {
  return (
    <div 
      className="absolute transition-opacity"
      style={{
        // Use the provided position from the location mapping
        ...position,
        transform: 'translate(-50%, -100%)',
        zIndex: sensor.mosquitoLevel === "high" ? 20 : 10,
        opacity: sensor.status === "inactive" ? 0.6 : 1
      }}
    >
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "p-1 rounded-full shadow-lg relative",
            sensor.status === "active" && sensor.mosquitoLevel === "low" && "bg-status-safe",
            sensor.status === "active" && sensor.mosquitoLevel === "medium" && "bg-status-warning",
            sensor.status === "active" && sensor.mosquitoLevel === "high" && "bg-status-danger",
            sensor.status === "inactive" && "bg-gray-400",
            sensor.status === "maintenance" && "bg-yellow-500",
          )}
        >
          {sensor.status === "active" && (
            <MapPin 
              className="h-6 w-6 text-white" 
              strokeWidth={2.5}
            />
          )}
          
          {sensor.status === "inactive" && (
            <CircleSlash 
              className="h-6 w-6 text-white" 
              strokeWidth={2.5}
            />
          )}
          
          {sensor.status === "maintenance" && (
            <Wrench 
              className="h-6 w-6 text-white" 
              strokeWidth={2.5}
            />
          )}
          
          {/* Animated radiating effect for high risk sensors */}
          {sensor.status === "active" && sensor.mosquitoLevel === "high" && (
            <div className="absolute inset-0 rounded-full bg-status-danger/30 animate-ping"></div>
          )}
        </div>
        <div className="mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium">
          {sensor.name}
          <span className="block text-xs font-normal text-gray-500">
            {sensor.status !== "active" && `(${sensor.status})`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SensorPin;

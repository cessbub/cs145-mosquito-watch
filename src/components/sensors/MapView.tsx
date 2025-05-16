
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SensorPin from "./map/SensorPin";
import MapLegend from "./map/MapLegend";

type SensorMapLocation = {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: "active" | "inactive" | "maintenance";
  mosquitoLevel: "low" | "medium" | "high";
};

interface MapViewProps {
  activeSensors: SensorMapLocation[];
  highRiskSensors: SensorMapLocation[];
}

const MapView = ({ activeSensors, highRiskSensors }: MapViewProps) => {
  // Location data for mapping sensor locations to positions on the map
  const locations = [
    { name: "Sunken Garden", position: { top: "28%", left: "32%" } },
    { name: "Science Complex", position: { top: "62%", left: "70%" } },
    { name: "UP Lagoon", position: { top: "58%", left: "45%" } },
    { name: "Oval Track", position: { top: "35%", left: "72%" } },
    { name: "College of Engineering", position: { top: "48%", left: "60%" } },
    { name: "Academic Oval", position: { top: "42%", left: "52%" } },
    { name: "Palma Hall", position: { top: "55%", left: "32%" } },
    { name: "University Avenue", position: { top: "70%", left: "52%" } },
    { name: "UP College of Science", position: { top: "62%", left: "75%" } },
    { name: "UP Diliman Quezon Hall", position: { top: "50%", left: "48%" } },
    { name: "Diliman Oval", position: { top: "40%", left: "60%" } },
  ];
  
  // Group sensors by location name
  const sensorsByLocation = activeSensors.reduce((groups, sensor) => {
    const location = sensor.location;
    if (!groups[location]) {
      groups[location] = [];
    }
    groups[location].push(sensor);
    return groups;
  }, {} as Record<string, SensorMapLocation[]>);
  
  // Sort sensors to ensure active sensors are rendered on top of inactive ones
  const getSortedSensors = (sensors: SensorMapLocation[]) => {
    return [...sensors].sort((a, b) => {
      // Sort by status priority (active > maintenance > inactive)
      const statusPriority: Record<string, number> = {
        active: 3,
        maintenance: 2,
        inactive: 1
      };
      return statusPriority[b.status] - statusPriority[a.status];
    });
  };
  
  // Map sensor names to location positions for consistent display
  const getSensorPosition = (sensorLocation: string, sensor: SensorMapLocation, index: number = 0, total: number = 1) => {
    const matchedLocation = locations.find(loc => loc.name === sensorLocation);
    
    if (!matchedLocation) return null;
    
    // Create a copy of the position
    const position = { ...matchedLocation.position };
    
    // Apply offset for multiple sensors in the same location
    if (total > 1) {
      // Calculate offset based on position in the group
      let offsetPercent = 2; // 2% offset for each pin
      
      // Special case for inactive sensors - give them extra offset to avoid overlaps
      if (sensor.status === "inactive") {
        offsetPercent = 5;
        const leftValue = parseFloat(position.left);
        const topValue = parseFloat(position.top);
        position.left = `${leftValue - 3}%`; // Move inactive sensors slightly to the left
        position.top = `${topValue - 5}%`;  // And up a bit
      } else {
        const centerIndex = Math.floor(total / 2);
        const offsetDirection = index - centerIndex;
        
        // Apply horizontal offset
        if (position.left) {
          const leftValue = parseFloat(position.left);
          position.left = `${leftValue + (offsetDirection * offsetPercent)}%`;
        }
      }
    }
    
    return position;
  };
  
  return (
    <div className="relative">
      {/* Map container */}
      <div className="h-96 bg-gray-100 rounded-md overflow-hidden relative">
        {/* Interactive map demo visualization */}
        <div className="absolute inset-0 bg-[#e8f4f8] overflow-hidden">
          {/* Map visual elements */}
          <div className="relative w-full h-full">
            {/* Simple grid for reference */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" className="opacity-30">
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ccc" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Sensor pins - positioned based on their location names with offset for duplicates */}
            {Object.entries(sensorsByLocation).map(([location, sensors]) => {
              const sortedSensors = getSortedSensors(sensors);
              return sortedSensors.map((sensor, index) => {
                const position = getSensorPosition(sensor.location, sensor, index, sensors.length);
                if (!position) return null;
                
                return (
                  <SensorPin 
                    key={sensor.id}
                    sensor={sensor}
                    sensorId={sensor.id}
                    position={position}
                  />
                );
              });
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <MapLegend />
    </div>
  );
};

// Helper function to convert position style object to absolute positioning values
function getPositionFromLocationStyle(position: {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}) {
  const result: { [key: string]: string } = {};
  
  if (position.top) result.top = position.top;
  if (position.bottom) result.bottom = position.bottom;
  if (position.left) result.left = position.left;
  if (position.right) result.right = position.right;
  
  return result;
}

export default MapView;

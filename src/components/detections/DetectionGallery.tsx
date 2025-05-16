
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Detection = {
  id: string;
  imageUrl: string;
  timestamp: string;
  confidence: number;
  sensorName: string;
  location: string;
  status: "confirmed" | "unconfirmed" | "rejected";
};

interface DetectionGalleryProps {
  detections: Detection[];
}

const DetectionGallery = ({ detections }: DetectionGalleryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {detections.map((detection) => (
        <Card key={detection.id} className="overflow-hidden">
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <img
              src={detection.imageUrl}
              alt={`Mosquito detection ${detection.id}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=500&q=60";
                console.log(`Image failed to load: ${detection.imageUrl}, using fallback`);
              }}
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
              {Math.round(detection.confidence * 100)}% confidence
            </div>
          </div>
          <CardContent className="p-3">
            <div className="text-sm font-medium">{detection.sensorName}</div>
            <div className="text-xs text-gray-500">{detection.location}</div>
            <div className="text-xs text-gray-500 mt-1">{detection.timestamp}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DetectionGallery;

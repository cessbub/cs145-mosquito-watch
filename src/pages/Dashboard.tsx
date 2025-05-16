
import React from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import DetectionGallery from "@/components/detections/DetectionGallery";
import { Bug, Map, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseSensors } from "@/hooks/useSupabaseSensors";
import { format } from "date-fns";
import { Loading } from "@/components/ui/loading";

const Dashboard = () => {
  const { 
    sensors, 
    detections, 
    loading, 
    error, 
    getActiveSensorsCount,
    getAlertLocationsCount,
    getDetectionsTodayCount
  } = useSupabaseSensors();

  // Format detections for the gallery
  const formattedDetections = detections.map(detection => ({
    id: detection.id,
    imageUrl: detection.image_url,
    timestamp: format(new Date(detection.timestamp), "yyyy-MM-dd hh:mm a"),
    confidence: detection.confidence,
    sensorName: detection.sensor?.name || "Unknown Sensor",
    location: detection.sensor?.location || "Unknown Location",
    status: "unconfirmed" as const
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor mosquito activity and manage your sensors.
        </p>
      </div>

      {loading ? (
        <Loading message="Loading dashboard data..." />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : (
        <>
          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatusCard 
              title="Active Sensors" 
              value={getActiveSensorsCount().toString()} 
              icon={<Map size={18} />}
              status="safe"
            />
            <StatusCard 
              title="Alert Locations" 
              value={getAlertLocationsCount().toString()} 
              icon={<AlertTriangle size={18} />}
              status="warning" 
            />
            <StatusCard 
              title="Detections Today" 
              value={getDetectionsTodayCount().toString()} 
              icon={<Bug size={18} />} 
              status="danger"
            />
          </div>

          {/* Recent Detections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Detections</CardTitle>
              <CardDescription>
                Latest mosquito detections from your sensors in UP Diliman
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formattedDetections.length > 0 ? (
                <DetectionGallery detections={formattedDetections} />
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  No detections to display.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;

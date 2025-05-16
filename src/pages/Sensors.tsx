
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SensorList, { Sensor } from "@/components/sensors/SensorList";
import FoggingDialog from "@/components/sensors/FoggingDialog";
import SensorDetailsDialog from "@/components/sensors/SensorDetailsDialog";
import MapView from "@/components/sensors/MapView";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseSensors, SensorType } from "@/hooks/useSupabaseSensors";
import { format } from "date-fns";
import { Loading } from "@/components/ui/loading";

// Extend Sensor type with coordinates for the map view
type SensorWithCoordinates = Sensor & {
  coordinates?: { lat: number; lng: number };
};

const Sensors = () => {
  const { toast } = useToast();
  const { 
    sensors: supabaseSensors, 
    loading, 
    error, 
    logFogging 
  } = useSupabaseSensors();
  
  const [foggingDialog, setFoggingDialog] = useState<{
    isOpen: boolean;
    sensorId: string | null;
    sensorName: string;
  }>({
    isOpen: false,
    sensorId: null,
    sensorName: ""
  });
  
  const [detailsDialog, setDetailsDialog] = useState<{
    isOpen: boolean;
    sensor: SensorWithCoordinates | null;
  }>({
    isOpen: false,
    sensor: null
  });

  // Map Supabase sensors data to the format expected by components
  const sensors: SensorWithCoordinates[] = supabaseSensors.map(s => ({
    id: s.id,
    name: s.name,
    location: s.location,
    status: s.status,
    mosquitoLevel: s.mosquito_level,
    lastUpdated: s.last_updated ? format(new Date(s.last_updated), "yyyy-MM-dd hh:mm a") : "",
    lastFogged: s.last_fogged ? format(new Date(s.last_fogged), "yyyy-MM-dd") : undefined,
    coordinates: s.coordinates
  }));

  const handleViewSensorDetails = (sensorId: string) => {
    const sensor = sensors.find(s => s.id === sensorId);
    if (sensor) {
      setDetailsDialog({
        isOpen: true,
        sensor
      });
    }
  };

  const handleLogFogging = (sensorId: string) => {
    const sensor = sensors.find(s => s.id === sensorId);
    if (!sensor) return;
    
    setFoggingDialog({
      isOpen: true,
      sensorId,
      sensorName: sensor.name
    });
  };

  const handleSubmitFoggingLog = async (sensorId: string, date: string, notes: string) => {
    if (!sensorId) return;
    
    const success = await logFogging(sensorId, date, notes);
    if (success) {
      toast({
        title: "Fogging log submitted",
        description: `Successfully logged fogging activity for ${foggingDialog.sensorName}`,
      });
    }

    setFoggingDialog({
      isOpen: false,
      sensorId: null,
      sensorName: ""
    });
  };

  // Pass ALL sensors to the map view, not just active ones
  const allSensors = sensors.map(s => ({
    id: s.id,
    name: s.name,
    location: s.location,
    coordinates: s.coordinates || { lat: 0, lng: 0 },
    status: s.status,
    mosquitoLevel: s.mosquitoLevel
  }));
  
  // Filter high risk sensors
  const highRiskSensors = allSensors.filter(s => s.mosquitoLevel === "high");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sensors</h1>
        <p className="text-muted-foreground">
          Manage and monitor your deployed mosquito sensors around UP Diliman.
        </p>
      </div>

      {loading ? (
        <Loading message="Loading sensors data..." count={5} />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sensor Network</CardTitle>
                <CardDescription>
                  View all sensors and their current status in UP Diliman.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SensorList 
                  sensors={sensors} 
                  onViewDetails={handleViewSensorDetails}
                  onLogFogging={handleLogFogging}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sensor Map</CardTitle>
                <CardDescription>
                  Map view of all UP Diliman sensor locations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MapView 
                  activeSensors={allSensors}
                  highRiskSensors={highRiskSensors}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <FoggingDialog 
        sensorId={foggingDialog.sensorId}
        sensorName={foggingDialog.sensorName}
        isOpen={foggingDialog.isOpen}
        onClose={() => setFoggingDialog({ isOpen: false, sensorId: null, sensorName: "" })}
        onSubmit={handleSubmitFoggingLog}
      />
      
      <SensorDetailsDialog 
        sensor={detailsDialog.sensor}
        isOpen={detailsDialog.isOpen}
        onClose={() => setDetailsDialog({ isOpen: false, sensor: null })}
      />
    </div>
  );
};

export default Sensors;

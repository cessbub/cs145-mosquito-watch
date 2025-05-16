
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sensor } from "./SensorList";

interface SensorDetailsDialogProps {
  sensor: Sensor | null;
  isOpen: boolean;
  onClose: () => void;
}

const SensorDetailsDialog = ({ sensor, isOpen, onClose }: SensorDetailsDialogProps) => {
  if (!sensor) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
  };

  const getMosquitoLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-status-safe/10 text-status-safe";
      case "medium":
        return "bg-status-warning/10 text-status-warning";
      case "high":
        return "bg-status-danger/10 text-status-danger";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {sensor.name}
            <Badge className={cn(getStatusColor(sensor.status))}>
              {sensor.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Sensor details and readings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{sensor.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{sensor.lastUpdated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mosquito Level</p>
              <Badge className={cn(getMosquitoLevelColor(sensor.mosquitoLevel))}>
                {sensor.mosquitoLevel}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Fogged</p>
              <p className="font-medium">{sensor.lastFogged || "Not recorded"}</p>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="font-medium mb-2">Recent Readings</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Temperature</span>
                <span className="font-medium">28°C</span>
              </li>
              <li className="flex justify-between">
                <span>Humidity</span>
                <span className="font-medium">78%</span>
              </li>
              <li className="flex justify-between">
                <span>Water Detection</span>
                <span className="font-medium">Positive</span>
              </li>
              <li className="flex justify-between">
                <span>Mosquito Activity</span>
                <span className="font-medium">{sensor.mosquitoLevel.charAt(0).toUpperCase() + sensor.mosquitoLevel.slice(1)}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button>View Full History</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SensorDetailsDialog;

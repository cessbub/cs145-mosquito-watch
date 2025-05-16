
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent 
} from "@/components/ui/hover-card";
import { Eye } from "lucide-react";

export type Sensor = {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "maintenance";
  mosquitoLevel: "low" | "medium" | "high";
  lastUpdated: string;
  lastFogged?: string;
};

interface SensorListProps {
  sensors: Sensor[];
  onViewDetails: (sensorId: string) => void;
  onLogFogging: (sensorId: string) => void;
}

const SensorList = ({ sensors, onViewDetails, onLogFogging }: SensorListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mosquito Level</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Last Fogged</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sensors.map((sensor) => (
            <TableRow key={sensor.id}>
              <TableCell className="font-medium">{sensor.name}</TableCell>
              <TableCell>{sensor.location}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    sensor.status === "active" && "bg-green-100 text-green-800 hover:bg-green-100",
                    sensor.status === "inactive" && "bg-gray-100 text-gray-800 hover:bg-gray-100",
                    sensor.status === "maintenance" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  )}
                >
                  {sensor.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    sensor.mosquitoLevel === "low" && "bg-status-safe/10 text-status-safe hover:bg-status-safe/20",
                    sensor.mosquitoLevel === "medium" && "bg-status-warning/10 text-status-warning hover:bg-status-warning/20",
                    sensor.mosquitoLevel === "high" && "bg-status-danger/10 text-status-danger hover:bg-status-danger/20"
                  )}
                >
                  {sensor.mosquitoLevel}
                </Badge>
              </TableCell>
              <TableCell>{sensor.lastUpdated}</TableCell>
              <TableCell>{sensor.lastFogged || "Not recorded"}</TableCell>
              <TableCell className="flex justify-end space-x-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewDetails(sensor.id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-2">
                    <p className="text-sm">View details for {sensor.name}</p>
                  </HoverCardContent>
                </HoverCard>
                <Button size="sm" onClick={() => onLogFogging(sensor.id)}>
                  Log Fogging
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SensorList;

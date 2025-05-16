
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatusLevel = "safe" | "warning" | "danger";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: StatusLevel;
  className?: string;
}

const StatusCard = ({ title, value, icon, status = "safe", className }: StatusCardProps) => {
  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div 
          className={cn(
            "p-2 rounded-full", 
            status === "safe" && "bg-status-safe/10 text-status-safe",
            status === "warning" && "bg-status-warning/10 text-status-warning",
            status === "danger" && "bg-status-danger/10 text-status-danger",
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;

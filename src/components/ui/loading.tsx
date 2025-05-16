
import React from "react";
import { Skeleton } from "./skeleton";
import { CloudFog } from "lucide-react";

interface LoadingProps {
  message?: string;
  count?: number;
}

export const Loading = ({ message = "Loading data...", count = 3 }: LoadingProps) => {
  return (
    <div className="w-full py-8 space-y-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-4">
          <CloudFog className="h-8 w-8 text-primary animate-pulse" />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent ml-2" />
        </div>
        <p className="text-muted-foreground text-center">{message}</p>
      </div>
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { useSensors } from './useSensors';
import { useDetections } from './useDetections';
import { useFoggingLogs } from './useFoggingLogs';
import { useSensorStatistics } from './useSensorStatistics';
import { SensorType, DetectionType, FoggingLogType } from '@/types/sensors';

// Use explicit 'export type' for re-exporting types when isolatedModules is enabled
export type { SensorType, DetectionType, FoggingLogType };

export const useSupabaseSensors = () => {
  const { sensors, loading: sensorsLoading, error: sensorsError, fetchSensors } = useSensors();
  const { detections, loading: detectionsLoading, error: detectionsError, fetchDetections } = useDetections();
  const { 
    foggingLogs, 
    loading: logsLoading, 
    error: logsError, 
    fetchFoggingLogs, 
    logFogging 
  } = useFoggingLogs();

  const { 
    getActiveSensorsCount, 
    getAlertLocationsCount, 
    getDetectionsTodayCount 
  } = useSensorStatistics(sensors, detections);

  // Combined loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Update loading and error states when the individual hook states change
  useEffect(() => {
    setLoading(sensorsLoading || detectionsLoading || logsLoading);
    
    // Combine errors if any
    const combinedError = sensorsError || detectionsError || logsError;
    setError(combinedError);
  }, [sensorsLoading, detectionsLoading, logsLoading, sensorsError, detectionsError, logsError]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      if (initialized) return;
      
      try {
        await Promise.all([
          fetchSensors(),
          fetchDetections(),
          fetchFoggingLogs()
        ]);
        setInitialized(true);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchAllData();
  }, []);

  return {
    sensors,
    detections,
    foggingLogs,
    loading,
    error,
    fetchSensors,
    fetchDetections,
    fetchFoggingLogs,
    logFogging,
    getActiveSensorsCount,
    getAlertLocationsCount,
    getDetectionsTodayCount
  };
};

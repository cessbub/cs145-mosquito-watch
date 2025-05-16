
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DetectionType } from '@/types/sensors';
import { convertToSensorType, validateSensorStatus, validateMosquitoLevel } from '@/utils/sensorDataUtils';

export const useDetections = () => {
  const [detections, setDetections] = useState<DetectionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch detections data
  const fetchDetections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('detections')
        .select(`
          *,
          sensor:sensor_id (
            id, name, location, status, mosquito_level, last_updated, last_fogged, coordinates
          )
        `)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Convert and type the fetched data
      const typedDetections: DetectionType[] = data?.map(detection => {
        // First, ensure sensor data is properly typed
        const sensorData = detection.sensor ? convertToSensorType(detection.sensor) : undefined;

        return {
          id: detection.id,
          sensor_id: detection.sensor_id,
          image_url: detection.image_url,
          confidence: detection.confidence,
          timestamp: detection.timestamp,
          sensor: sensorData
        };
      }) || [];

      setDetections(typedDetections);
      return typedDetections; // Return the detections for immediate use
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error fetching detections',
        description: err.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    detections,
    loading,
    error,
    fetchDetections
  };
};

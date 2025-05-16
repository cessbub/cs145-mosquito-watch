
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SensorType } from '@/types/sensors';
import { convertToSensorType } from '@/utils/sensorDataUtils';

export const useSensors = () => {
  const [sensors, setSensors] = useState<SensorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch sensors data
  const fetchSensors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sensors')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Type cast the data to ensure it matches our SensorType
      const typedSensors: SensorType[] = data?.map(sensor => convertToSensorType(sensor)) || [];
      setSensors(typedSensors);
      return typedSensors; // Return the sensors for immediate use
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error fetching sensors',
        description: err.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    sensors,
    loading,
    error,
    fetchSensors
  };
};

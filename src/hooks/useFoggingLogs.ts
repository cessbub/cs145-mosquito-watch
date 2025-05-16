
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FoggingLogType } from '@/types/sensors';

export const useFoggingLogs = () => {
  const [foggingLogs, setFoggingLogs] = useState<FoggingLogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch fogging logs
  const fetchFoggingLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fogging_logs')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setFoggingLogs(data || []);
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Log new fogging activity
  const logFogging = async (sensorId: string, date: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('fogging_logs')
        .insert({
          sensor_id: sensorId,
          date,
          notes,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Update the sensor's mosquito level to low and set last_fogged
      await supabase
        .from('sensors')
        .update({
          mosquito_level: 'low',
          last_fogged: date,
        })
        .eq('id', sensorId);

      // Refresh data
      await fetchFoggingLogs();
      
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error logging fogging activity',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    foggingLogs,
    loading,
    error,
    fetchFoggingLogs,
    logFogging
  };
};


import { Json } from '@/integrations/supabase/types';
import { SensorType } from '@/types/sensors';

export const validateSensorStatus = (status: string): 'active' | 'inactive' | 'maintenance' => {
  if (status === 'active' || status === 'inactive' || status === 'maintenance') {
    return status as 'active' | 'inactive' | 'maintenance';
  }
  return 'inactive'; // Default fallback
};

export const validateMosquitoLevel = (level: string): 'low' | 'medium' | 'high' => {
  if (level === 'low' || level === 'medium' || level === 'high') {
    return level as 'low' | 'medium' | 'high';
  }
  return 'low'; // Default fallback
};

export const convertToSensorType = (sensor: any): SensorType => {
  return {
    id: sensor.id,
    name: sensor.name,
    location: sensor.location,
    status: validateSensorStatus(sensor.status),
    mosquito_level: validateMosquitoLevel(sensor.mosquito_level),
    last_updated: sensor.last_updated,
    last_fogged: sensor.last_fogged,
    coordinates: sensor.coordinates as { lat: number; lng: number } | null
  };
};


import { Json } from '@/integrations/supabase/types';

export type SensorType = {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  mosquito_level: 'low' | 'medium' | 'high';
  last_updated: string;
  last_fogged: string | null;
  coordinates: { lat: number; lng: number } | null;
};

export type DetectionType = {
  id: string;
  sensor_id: string;
  image_url: string;
  confidence: number;
  timestamp: string;
  sensor?: SensorType;
};

export type FoggingLogType = {
  id: string;
  sensor_id: string;
  date: string;
  notes: string | null;
};

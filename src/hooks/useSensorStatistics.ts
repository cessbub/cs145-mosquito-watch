
import { useState } from 'react';
import { SensorType, DetectionType } from '@/types/sensors';

export const useSensorStatistics = (sensors: SensorType[], detections: DetectionType[]) => {
  // Statistics functions
  const getActiveSensorsCount = () => {
    return sensors.filter(s => s.status === 'active').length;
  };

  const getAlertLocationsCount = () => {
    return sensors.filter(s => s.mosquito_level === 'high').length;
  };

  const getDetectionsTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return detections.filter(d => {
      const detectionDate = new Date(d.timestamp);
      return detectionDate >= today;
    }).length;
  };

  return {
    getActiveSensorsCount,
    getAlertLocationsCount,
    getDetectionsTodayCount
  };
};

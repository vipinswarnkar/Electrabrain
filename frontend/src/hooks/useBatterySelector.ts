import { useState } from 'react';
import { AVAILABLE_BATTERY_IDS } from '@/data/realAnalytics';

// Shared battery-pack selector state, used across the Analytics pages
// so each page can switch between real B0005/6/7/18 data.
export function useBatterySelector(defaultId: string = AVAILABLE_BATTERY_IDS[0]) {
  const [selectedBatteryId, setSelectedBatteryId] = useState(defaultId);
  return { selectedBatteryId, setSelectedBatteryId, availableIds: AVAILABLE_BATTERY_IDS };
}

import type { BatteryService } from '@/services/types';
import { REAL_BATTERIES } from '@/data/realBatteries';

// Real battery data: computed by running the actual trained AHRF-v1
// model against real NASA cycles (B0005/6/7/18). See
// ml/extract_multi_battery.py and src/data/realBatteries.ts.
export const realBatteryService: BatteryService = {
  async getBatteries() {
    return REAL_BATTERIES;
  },
  async getBattery(id: string) {
    return REAL_BATTERIES.find((b) => b.id === id) ?? null;
  },
};

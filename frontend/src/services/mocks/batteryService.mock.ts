import type { BatteryService } from '@/services/types';
import { MOCK_BATTERIES } from './batteryData.mock';

export const mockBatteryService: BatteryService = {
  async getBatteries() {
    return MOCK_BATTERIES;
  },
  async getBattery(id: string) {
    return MOCK_BATTERIES.find((b) => b.id === id) ?? null;
  },
};

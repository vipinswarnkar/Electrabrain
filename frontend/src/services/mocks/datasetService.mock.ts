import type { DatasetService } from '@/services/types';
import type { Dataset } from '@/types';
import { mockDatasets } from './datasetData.mock';

export const mockDatasetService: DatasetService = {
  async getDatasets() {
    return mockDatasets;
  },
  async getDataset(id: string) {
    return mockDatasets.find((dataset) => dataset.id === id) ?? null;
  },
  async uploadDataset(input) {
    const nextDataset: Dataset = {
      id: `custom-${Date.now()}`,
      name: input.name,
      description: input.description,
      source: input.source,
      status: input.status ?? 'processing',
      recordCount: 0,
      batteryCount: 0,
      featureCount: 0,
      schema: [],
      uploadedAt: new Date().toISOString().slice(0, 10),
      sizeBytes: 0,
      version: 'v0.1',
      cycleCount: 0,
      batteries: [],
      features: [],
      statistics: {
        observations: 0,
        missingValues: 0,
        normalized: false,
        lastUpdated: new Date().toISOString().slice(0, 10),
      },
      previewRows: [],
    };

    mockDatasets.unshift(nextDataset);
    return nextDataset;
  },
};

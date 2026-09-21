import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { predictionService } from '@/services';
import liveDemoCycles from '@/data/live_demo_cycles.json';
import type { LiveCycleInput } from '@/services/api/predictionService.live';
import type { PredictionResponse } from '@/types';

const CYCLES = liveDemoCycles as Record<string, LiveCycleInput[]>;
const AVAILABLE_BATTERIES = Object.keys(CYCLES);

// Demo page: proves the full pipeline (React -> FastAPI -> AHRF-v1 model)
// works, using real NASA discharge cycles from any of the 4 real batteries.
export function LivePredictionDemoPage() {
  const [selectedBatteryId, setSelectedBatteryId] = useState(AVAILABLE_BATTERIES[0]);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunPrediction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (!predictionService.runLivePrediction) {
        throw new Error('runLivePrediction is not available on predictionService.');
      }
      const cycles = CYCLES[selectedBatteryId];
      const prediction = await predictionService.runLivePrediction(cycles);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed. Is the FastAPI server running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '640px' }}>
      <h1 style={{ marginBottom: '8px' }}>Live Prediction Demo</h1>
      <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary, #666)' }}>
        Sends 3 real NASA discharge cycles from the selected battery to the FastAPI backend and shows the
        live SOC/SOH/RUL prediction from the AHRF-v1 model.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="battery-select" style={{ marginRight: '8px', fontWeight: 500 }}>
          Battery pack:
        </label>
        <select
          id="battery-select"
          value={selectedBatteryId}
          onChange={(e) => { setSelectedBatteryId(e.target.value); setResult(null); }}
          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          {AVAILABLE_BATTERIES.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      <Button onClick={handleRunPrediction} disabled={loading}>
        {loading ? 'Running prediction...' : `Run Live Prediction (${selectedBatteryId})`}
      </Button>

      {error && (
        <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #e33', borderRadius: '8px', color: '#e33' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <p><strong>Battery:</strong> {selectedBatteryId}</p>
          <p><strong>SOC:</strong> {result.soc.predictedValue.toFixed(2)}%</p>
          <p><strong>SOH:</strong> {result.soh.predictedValue.toFixed(2)}%</p>
          <p><strong>RUL:</strong> {result.rul.predictedValue.toFixed(2)} cycles</p>
        </div>
      )}
    </div>
  );
}

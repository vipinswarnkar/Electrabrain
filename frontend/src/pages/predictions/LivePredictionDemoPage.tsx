import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { predictionService } from '@/services';
import { SAMPLE_RECENT_CYCLES } from '@/data/samplePrediction.fixture';
import type { PredictionResponse } from '@/types';

// Demo page: proves the full pipeline (React -> FastAPI -> AHRF-v1 model)
// works, using 3 real NASA B0005 discharge cycles as sample input.
export function LivePredictionDemoPage() {
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
      const prediction = await predictionService.runLivePrediction(SAMPLE_RECENT_CYCLES);
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
      <p style={{ marginBottom: '24px', color: 'var(--color-text-secondary, #666)' }}>
        Sends 3 real NASA B0005 discharge cycles to the FastAPI backend and shows
        the live SOC/SOH/RUL prediction from the AHRF-v1 model.
      </p>

      <Button onClick={handleRunPrediction} disabled={loading}>
        {loading ? 'Running prediction...' : 'Run Live Prediction'}
      </Button>

      {error && (
        <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #e33', borderRadius: '8px', color: '#e33' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <p><strong>SOC:</strong> {result.soc.predictedValue.toFixed(2)}%</p>
          <p><strong>SOH:</strong> {result.soh.predictedValue.toFixed(2)}%</p>
          <p><strong>RUL:</strong> {result.rul.predictedValue.toFixed(2)} cycles</p>
        </div>
      )}
    </div>
  );
}

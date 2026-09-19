# SBMS Integration — Battery Health Prediction Dashboard

Full-stack integration of an Adaptive Hybrid Random Forest (AHRF) battery
health model with a FastAPI backend and React dashboard — predicts SOC,
SOH, and RUL for lithium-ion batteries from real NASA B0005 cycle data.

## Architecture

React Dashboard (Vite, port 5173)
        |  HTTP (axios)
        v
FastAPI Backend (port 8000)
   POST /predict   GET /health
        |  calls
        v
ml/predict.py
   - Loads AHRF-v1 models (SOC/SOH/RUL) via joblib, once at startup
   - Runs raw cycle data through the same feature engineering pipeline
     used in training: per-cycle statistics, 5-cycle rolling/trend
     features, capacity fade rate
   - Imputes missing values, then predicts
   - Passes results through decision_engine/rules.py for a status label

## Project structure

sbms-integration/
├── frontend/     React + TypeScript dashboard (originally by Friend B)
├── backend/      FastAPI wrapper around the ML pipeline
├── ml/           Trained AHRF-v1 models + feature engineering code
│                 (originally by Friend A, reorganized for serving)
└── README.md

## Running locally

Requires 3 terminals running simultaneously:

1. Backend (FastAPI):
cd backend
source ../ml/.venv/Scripts/activate
uvicorn main:app --reload --port 8000

2. Frontend (React):
cd frontend
npm run dev

3. Visit http://localhost:5173/predictions/live-demo (or click
"Live Demo" in the sidebar under "AI & Predictions") and click
"Run Live Prediction" to see a live SOC/SOH/RUL prediction computed from
real NASA battery discharge cycle data, served by the FastAPI backend.

## Scope and current limitations

- Most dashboard pages (Dashboard, Batteries, Alerts, etc.) still use
  Friend B's original mock/placeholder data. Only the Live Prediction
  Demo page is connected to the real backend and real model.
- The live demo sends a fixed set of 3 real NASA cycles rather than
  supporting free-form data upload.
- No database -- predictions are computed on demand and not persisted.
- These were deliberate scope choices to focus on proving the
  ML-to-API-to-UI integration is correct end-to-end, which was the
  primary technical goal of this project.

## Key design decisions

- AHRF-v1, not v2: the original ML repo's own validation (Notebook 08)
  confirms only AHRF-v1 is used in the production decision pipeline; v2
  is experimental.
- Multi-cycle input, not single-reading: the model relies on 5-cycle
  rolling/trend features, so /predict expects a short history of
  recent cycles, not one isolated reading.
- Live prediction is additive, not integrated into the existing mock
  battery list: FastAPI has no database of stored batteries/predictions,
  so predictionService.runLivePrediction() was added as a new method
  alongside the existing mock-backed getPredictions()/getPrediction(),
  rather than forcing a mismatch between the two.

## Credits

- ML model & feature pipeline: Friend A (https://github.com/TTeerrtthh/SBMS_PROJECT)
- Dashboard UI: Friend B (https://github.com/tanuja0403/FINALUI)
- Integration, FastAPI backend, live prediction wiring: this repo

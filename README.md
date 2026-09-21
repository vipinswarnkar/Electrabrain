# SBMS — Smart Battery Management System

A full-stack battery health prediction system that estimates State of
Charge (SOC), State of Health (SOH), and Remaining Useful Life (RUL)
for lithium-ion batteries, using a custom machine learning model served
through a FastAPI backend and a React dashboard. Evaluated against real
NASA battery test data (B0005, B0006, B0007, B0018).

## What this solves

Battery degradation can't be measured directly — SOH and RUL are
inferred from patterns across many charge/discharge cycles, not read
off a single sensor. Predicting them ahead of failure enables
predictive maintenance instead of reactive replacement.

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
   - Passes results through a rule-based decision engine for a status
     label (Healthy / Warning / Critical)

Most of the dashboard's data-driven pages (Dashboard, Batteries,
Predictions, Alerts, Model Comparison, Analytics, AHRF Model,
Explainable AI) are built from one-time extraction scripts that run the
real trained model against real NASA data and save the results as JSON.
This keeps the app fast and avoids needing a database, while every
number shown is genuine model output rather than placeholder data. The
Live Prediction Demo page is the exception: it calls FastAPI live, in
real time, for a fully interactive demo.

## The model: AHRF (Adaptive Hybrid Random Forest)

A Random Forest whose final prediction is a weighted average of its
trees, rather than a plain average. Each tree's weight is derived from
its own out-of-bag (OOB) error — trees that generalize better on data
they never saw during their own training get more influence over the
final prediction. Two variants exist (AHRF-v1, the production model,
and an experimental AHRF-v2); this project's own real evaluation
confirmed v1 and v2 perform almost identically, and v1 is used for
serving. See the AHRF Model page for real hyperparameters and real
learned tree weights, and the Explainable AI page for real SHAP feature
attributions.

## Project structure

sbms-integration/
├── frontend/     React + TypeScript dashboard
├── backend/      FastAPI wrapper around the ML pipeline
├── ml/           Trained AHRF models, feature engineering pipeline, and
│                 data-extraction scripts used to generate the real
│                 results committed to the repo
└── README.md

## Running locally

Requires 3 terminals running simultaneously:

1. Backend (FastAPI) — only needed for the Live Prediction Demo page:
cd backend
source ../ml/.venv/Scripts/activate
uvicorn main:app --reload --port 8000

2. Frontend (React):
cd frontend
npm run dev

3. Visit http://localhost:5173/dashboard to see real predictions,
alerts, and analytics for 4 real NASA batteries. Visit
http://localhost:5173/predictions/live-demo (or click "Live Demo" in
the sidebar) for a live, real-time prediction served by FastAPI.

## What's real vs. what's out of scope

Real, backed by the actual trained model and real NASA test data:
- Dashboard (KPIs, SOH/RUL trends, degradation chart, model performance)
- Batteries, Predictions, Live Prediction Demo
- Alerts (generated from real WARNING/CRITICAL model outputs)
- Model Comparison (real RMSE/MAE/R2 across 3 model variants, evaluated
  on real held-out batteries)
- Health Analysis, Degradation Trends, Cycle Analysis (with a real
  per-battery selector across all 4 batteries)
- Live Monitoring
- AHRF Model (real hyperparameters and real learned tree weights)
- Explainable AI (real SHAP TreeExplainer output — global feature
  importance and per-battery local explanations)

Deliberately out of scope for this build:
- Optimization / hyperparameter tuning page — reproducing this live
  would require re-running search, potentially hours of runtime, for
  comparatively low value versus the pages above
- Free-form data upload — the live demo uses a fixed real dataset
  rather than an upload flow
- Reports, Experiments, Maintenance — placeholder pages, not central
  to demonstrating the core prediction pipeline

## Real findings from evaluation

- RUL prediction does not generalize well to unseen batteries (negative
  R2 on held-out data), while SOC and SOH do (R2 ~0.89–0.92). The model
  was trained only on B0005; RUL appears to rely heavily on that
  battery's specific degradation curve. SHAP confirms this — RUL's top
  features are dominated by one signal family (discharge-duration
  statistics), unlike SOC/SOH's broader feature reliance.
- AHRF's OOB tree-weighting meaningfully differentiates trees for SOH
  (weights span ~137x between the strongest and weakest tree) but is
  nearly uniform for RUL (~1.8x spread) — consistent with AHRF barely
  outperforming a plain Random Forest baseline specifically on RUL.
- Two batteries of the same model (B0005, B0006), tested under
  identical protocols, converge to very similar SHAP explanations at
  end-of-life, while a third (B0007) shows a distinctly different
  pattern — evidence the explanations reflect genuine per-battery state
  rather than being hardcoded.

## Key design decisions

- Multi-cycle input, not single-reading: the model relies on 5-cycle
  rolling/trend features, so predictions require a short history of
  recent cycles rather than one isolated reading.
- Real extracted data over a live database: rather than standing up a
  database for a project of this scope, real model output was
  precomputed and committed as data — keeping every number genuine
  while avoiding unnecessary infrastructure.
- Live prediction kept additive: the interactive demo calls FastAPI
  directly, separate from the precomputed dashboard data, so the one
  fully real-time path in the app is clearly demonstrable on its own.

## Team & Contributions

- **ML Model & Feature Engineering** — Teerth Lalwani
- **Dashboard UI** — Tanuja Anilkumar
- **Systems Integration, FastAPI Backend, Real-Data Pipeline, Model
  Evaluation & SHAP Analysis** — Vipin Swarnkar

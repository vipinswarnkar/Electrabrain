# Setup Guide — Running This Project on a New Machine

This guide is for anyone cloning this repo fresh (a teammate, examiner,
or you on a different computer). Follow these steps in order.

## Prerequisites

Install these first if not already present:
- **Git** — https://git-scm.com/downloads
- **Python 3.11+** — https://www.python.org/downloads/ (when installing on
  Windows, check "Add Python to environment variables" / "Add to PATH")
- **Node.js** (includes npm) — https://nodejs.org/

## 1. Clone the repository

```bash
git clone https://github.com/vipinswarnkar/sbms-integration.git
cd sbms-integration
```

If the repo is private, you'll need to be added as a collaborator first,
or authenticate with a GitHub Personal Access Token when prompted.

## 2. Set up the ML environment

```bash
cd ml
python -m venv .venv
```

Activate it:
- **Windows (Git Bash):** `source .venv/Scripts/activate`
- **Mac/Linux:** `source .venv/bin/activate`

You should see `(.venv)` appear at the start of your terminal prompt.

Install dependencies:
```bash
pip install -r requirements.txt
pip install scikit-learn==1.9.0 joblib fastapi "uvicorn[standard]"
```

(scikit-learn is pinned to 1.9.0 specifically -- this matches the
version the models were originally trained with, and avoids a version
mismatch warning.)

## 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create the environment file (this is intentionally not committed to
git, since it can hold machine-specific or secret values):
```bash
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

## 4. Run the project

You need **2 terminals running at the same time**, plus a 3rd free for
any other commands.

**Terminal 1 — backend (FastAPI):**
```bash
cd sbms-integration/backend
source ../ml/.venv/Scripts/activate
uvicorn main:app --reload --port 8000
```
Wait for `Application startup complete`. Leave this terminal running.

**Terminal 2 — frontend (React):**
```bash
cd sbms-integration/frontend
npm run dev
```
Wait for `Local: http://localhost:5173/`. Leave this terminal running.

## 5. Open it

Go to `http://localhost:5173/dashboard` in your browser. You should see
real battery predictions for 4 real NASA batteries.

For the fully live, real-time demo (FastAPI called live from the
browser), go to `http://localhost:5173/predictions/live-demo` or click
"Live Demo" in the sidebar, pick a battery, and click "Run Live
Prediction".

## Troubleshooting

- **`python`/`npm` not recognized:** the installer likely didn't add it
  to your system PATH. Reinstall and make sure that option is checked,
  then open a brand new terminal window (existing ones won't pick up
  the change).
- **Page loads but shows "Network Error" on the Live Demo page:** the
  FastAPI backend (Terminal 1) isn't running. Check that terminal for
  errors, or restart it.
- **A page looks broken/blank after pulling new changes:** try a hard
  refresh (Ctrl+Shift+R) in the browser, or restart the frontend
  (`Ctrl+C` in Terminal 2, then `npm run dev` again).

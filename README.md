# ArrayIQ — AI-Powered Algorithm Intelligence

ArrayIQ is a production-ready, full-stack platform for algorithm analysis, benchmarking, and visualization. Designed for speed, precision, and educational clarity, it helps developers choose the optimal algorithm for every array operation.

## 🚀 Key Features

- **Intelligence Engine**: AI-driven recommendations based on array entropy and size.
- **Dynamic Visualizers**: Interactive traversal and mutation tracking for 17+ algorithms.
- **Benchmark Dashboard**: Real-time telemetry comparison with sub-millisecond precision.
- **Advanced Insights**: Automated statistical analysis (Median, Mode, Frequency, etc.).
- **Quantum Simulation**: Sandbox for exploring Grover's search and theoretical speedups.
- **Premium SaaS UI**: Dark-mode luxury design with fluid Framer Motion animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Typing**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Scrolling**: Lenis Smooth Scroll

### Backend
- **Core**: FastAPI (Python)
- **Validation**: Pydantic
- **Math**: NumPy
- **Server**: Uvicorn

## 📂 Project Structure

```
frontend/
├── src/
│   ├── assets/       # Branding and Media
│   ├── components/   # Atomic UI & Visualizers
│   ├── pages/        # Route-level views
│   ├── utils/        # Telemetry & Formatting
│   └── App.tsx       # Core Routing
backend/
├── algorithms/       # Logic for Sort/Search/Quantum
├── recommendation/   # Intelligence Engine
├── benchmark/        # Telemetry Suite
└── main.py           # FastAPI Entry
```

## 🚥 Quick Start

### 1. Start the API (Backend)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Start the Lab (Frontend)
```bash
cd frontend
npm install
npm run dev
```

## 📘 Documentation
Detailed documentation can be found in the `docs/` directory:
- [Architecture & Data Flow](./docs/architecture.md)
- [Algorithm Suite Specs](./docs/algorithms.md)

# Architecture Documentation

## System Overview

ArrayIQ is a full-stack application following a decoupled architecture:

1.  **Frontend**: A React-based Single Page Application (SPA) that handles UI, state management, and client-side animations.
2.  **Backend**: A FastAPI-based REST API that provides algorithmic logic, benchmarking engines, and data analysis.

## Core Modules

### Backend
- **Algorithms**: Pure Python implementations of sorting, searching, and quantum simulations.
- **Engine**: Recommendation and Benchmarking logic that utilizes algorithm modules.
- **API**: FastAPI routes providing endpoints for the frontend to consume.

### Frontend
- **Components**: Reusable UI elements (Buttons, Cards, Modals).
- **Visualizers**: Specialized components for step-by-step algorithm animation.
- **Charts**: Recharts integration for performance telemetry.
- **Services**: Axios-based API client for backend communication.

## Data Flow
1. User provides input (array/target) via the Frontend.
2. Frontend sends request to Backend API.
3. Backend performs requested operation (Sort/Search/Benchmark).
4. Backend returns results (Sorted array, metrics, analysis).
5. Frontend updates state and triggers animations/chart updates.

# ArrayIQ Deployment Documentation

## Frontend Deployment (Vercel)
The frontend is built with React, Vite, and TypeScript.

### Configuration
`vercel.json`:
```json
{
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Build Command
`npm run build`

## Backend Deployment (Render)
The backend is a FastAPI application.

### Configuration
- **Runtime**: Python 3.11+
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Environment Variables
- `PORT`: (Managed by Render)
- `CORS_ORIGINS`: Set to your Vercel URL for production security.

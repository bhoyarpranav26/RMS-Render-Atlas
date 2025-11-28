# Setting VITE_API_URL on Render

Use `VITE_API_URL` to tell the frontend where the backend API is hosted. Two common values:

- If your API root is the server host: `VITE_API_URL=https://rms-render-atlas-1-pf0i.onrender.com`
- If your API endpoints are mounted under `/api`: `VITE_API_URL=https://rms-render-atlas-1-pf0i.onrender.com/api`

How to set the variable on Render:

1. Open your service dashboard on Render.
2. Choose the frontend service.
3. Go to Environment → "Environment Variables" (or the Settings tab where env vars are managed).
4. Add a variable named `VITE_API_URL` with the desired value.
5. Redeploy the service (Render will pick up new env vars on deploy).

Notes:

- Vite exposes variables prefixed with `VITE_` to client-side code (e.g., `import.meta.env.VITE_API_URL`).
- Do not store secrets (API keys, passwords) in client-exposed env variables.
- For local development, copy `frontend/.env.local.example` to `frontend/.env.local` and adjust the URL.
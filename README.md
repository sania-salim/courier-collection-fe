# Courier Collection — Frontend

React + TypeScript frontend for the Courier Collection application, structured after `cues-card` and wired to `courier-collection-be`.

## Pages

- **Package Listing** (`/`) — searchable table with status filter chips and summary stats
- **Tracking** (`/tracking`) — lookup by tracking ID with status chip and progress timeline

## Setup

```bash
npm install
```

Ensure the backend is running on port 5000:

```bash
cd ../courier-collection-be
npm run dev
```

Start the frontend (proxies `/api` → `http://localhost:5000`):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base URL (`/api` in dev with Vite proxy, or `http://localhost:5000` in production) |

## Sample tracking IDs (after backend seed)

- `d0000001-0000-4000-8000-000000000001` — To Be Picked Up
- `d0000001-0000-4000-8000-000000000002` — In Transit
- `d0000001-0000-4000-8000-000000000003` — Delivered

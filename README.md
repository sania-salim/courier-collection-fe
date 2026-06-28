# Courier Collection — Stage 2 Frontend

React 19 + TypeScript frontend for the Stage 2 courier collection application. Project structure follows `cues-card` / `courier-collection-fe` and connects to `courier-collection-stage-2` on port **5001**.

## Stack

- React 19, TypeScript, Vite 6
- MUI 6 + Emotion
- React Router 7
- Axios + react-toastify

## Folder structure

```
src/
├── components/       # Reusable UI (Header, Layout, Table, …)
├── constants/        # API endpoints, column defs, string constants
├── contexts/         # React context providers (ThemeContext, …)
├── pages/            # Route-level screens (one folder per page)
├── router/           # routes.ts + Router.tsx
├── services/         # axios client
├── styles/           # MUI theme + themeConstants
├── types/            # Shared TypeScript types
└── utils/            # apiUtils + requests/*.api.ts
```

## Setup

```bash
cd courier-collection-stage-2-fe
npm install
cp .env.sample .env.development   # if needed
npm run dev
```

Ensure the Stage 2 backend is running:

```bash
cd ../courier-collection-stage-2
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). Vite proxies `/api` → `http://localhost:5001`.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base URL (`/api` in dev with Vite proxy, or full URL in production) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## How to simulate a package journey

The UI does not move packages automatically. You set up data, then advance the system one step at a time with **Simulate journey** on the **Packages** page. Each click runs one simulator tick on the oldest active journey (`SCHEDULED` or `IN_PROGRESS`).

### Prerequisites

1. Start the backend and seed demo data (from `courier-collection-stage-2`):

   ```bash
   docker compose up -d
   npm run seed
   npm run dev
   ```

2. Start this frontend (`npm run dev`) and open [http://localhost:3001](http://localhost:3001).

Seeded routes include `BLR-COK-TVM`, `BLR-TVM-001`, `BLR-MAA-001`, `COK-MAA-001`, `COK-SXE-MAA`, `TVM-02`, and `MAA-02`. Each route also has an empty open sealed bag at its first stop.

### Step-by-step workflow

#### 1. Create a route (optional if using seeded routes)

**Routes** → **Add route** → add region stops in travel order (e.g. Bangalore → Kochi → Trivandrum).

The route defines which hubs a vehicle visits and which package destinations can be bagged at each hub.

#### 2. Create a journey

**Journeys** → **Add journey** → pick the route and an **available** vehicle.

The journey starts as `SCHEDULED` at the route’s first stop. Only one active journey is processed per simulate click, so finish or complete one journey before relying on another.

#### 3. Create a package

**Packages** → **Add package** and set:

| Field | What to choose |
|-------|----------------|
| **From region** | A hub on your journey’s route (usually the first stop, e.g. Bangalore) |
| **To region** | A stop **after** the from region on that same route (e.g. Trivandrum on `BLR-COK-TVM`) |
| **Weight** | **5 kg or less** — sealed bags have a 5 kg limit; heavier packages are skipped during consolidation |

Packages are created as `TO_BE_PICKED_UP` at the from region and are ready for bagging without a separate pickup step.

If you need a sender business, add one under **External Businesses** first (or use **Add new external business** in the package dialog).

#### 4. Simulate

On **Packages**, click **Simulate journey** (enabled only when at least one active journey exists).

Each click advances **one** journey by **one** step. Toast messages describe what happened. Typical sequence for a new `SCHEDULED` journey from Bangalore:

1. **Consolidate** — eligible packages at the hub are added to open bags on that route  
2. **Seal** — non-empty open bags are sealed  
3. **Load** — sealed bags are loaded onto the journey’s vehicle  
4. **Depart** — journey becomes `IN_PROGRESS` and heads to the next stop  

Further clicks simulate **arrivals** at intermediate hubs (unload, re-consolidate, reload) until the **final stop**, where packages are unloaded and the journey completes.

#### 5. Track progress

- **Packages** list — status and current location columns update after each simulate click  
- **Package detail** (click a package code) — full **scan log** timeline and map showing origin, destination, and current hub  

### Rules that often block bagging

- **No active journey** — create a journey before simulating; the button stays disabled otherwise  
- **Destination not downstream** — package `to region` must appear **later** on the journey route than its current hub (e.g. a Kochi → Salem package bags on `COK-SXE-MAA`, not on `BLR-COK-TVM`)  
- **Weight over 5 kg** — consolidation skips the package; the simulate toast will say the bag limit was exceeded  
- **Wrong hub** — a package is only consolidated when the journey is at the hub where the package currently sits  

### Example: Bangalore → Kochi → Trivandrum

1. Journey on route **`BLR-COK-TVM`** with vehicle **1001**  
2. Package: from **Bangalore**, to **Trivandrum**, weight **3 kg**  
3. Click **Simulate journey** until the journey departs from Bangalore — package should move to `ADDED_TO_BAG`, then `EN_ROUTE_TO_REGION`  
4. Keep simulating through Kochi arrival and onward; open the package detail page to follow the scan log  

### Tips

- Re-run `npm run seed` in the backend to reset demo routes, bags, and vehicles (existing packages in the database are not removed).  
- If simulate reports skipped packages, check weight and that from/to regions match the active journey’s route.  
- After a journey completes, the vehicle becomes available again for a new journey.

# Stage 2 — Courier Logistics Application
## Frontend Requirements Document

---

## 1. Overview

This document defines the frontend requirements for the **Stage 2 Courier Logistics Application** — the back-office system used by regional hub staff to manage packages, sealed bags, vehicles, journeys, and routes. This application is not accessible to the public or front-office staff.

---

## 2. Design Guidelines

>
> - Figma MCP link: https://www.figma.com/design/UgTU3KTVWctXKdEwMj47v3/Team-Building-React?node-id=2001-2&p=f&t=vAPTJGazYl0MRajz-0
> - The tracking page Figma frame serves as the skeletal reference for layout patterns and component structure. Improve upon it — do not replicate it exactly.
> - Tech stack: **Tailwind CSS + MUI (Material UI)**
> - Use MUI to build the UI components and use tailwind for rest of styling
> - Typography, colour tokens, and component variants should be defined here once confirmed.

---

## 3. General UI Principles

- Every list page must support **search**, **sort**, and **pagination**
- Pagination default: **20 items per page**
- All timestamps displayed in **local time** with date and time (e.g. `15 Jan 2024, 10:23 AM`)
- Status values rendered as **colour-coded chips/badges** — not plain text
- Empty states must show a descriptive message and a primary action where relevant (e.g. "No vehicles found. Add a vehicle.")
- Error states must show what went wrong and how to recover
- All destructive actions (cancel, delete) require a **confirmation dialog**
- Forms use **inline validation** — errors shown per field on blur, not only on submit

---

## 4. Pages and Features

---

### 4.1 Regions

**Route:** `/regions`

**Purpose:** View and manage regional hubs. Read-only in normal operation — regions are reference data seeded at setup.

**List view:**
- Table columns: Region Name, Region Code, Latitude, Longitude
- Search by name or code
- Sort by name or code
- No pagination needed (small fixed dataset)
- Each row links to a region detail view

**Detail view (`/regions/:id`):**
- Displays all region fields
- Shows list of front offices belonging to this region
- Shows list of route stops that include this region

---

### 4.2 Packages

**Route:** `/packages`

**Purpose:** View all courier packages in the system and their current status.

**List view:**
- Table columns: Package Code, From Region, To Address, Status (chip), Sealed Bag, Created At
- Search by package code or to-address
- Filter by status (multi-select dropdown): `TO_BE_PICKED_UP`, `PICKED_UP`, `ADDED_TO_BAG`, `EN_ROUTE_TO_REGION`, `ARRIVED_AT_REGION`, `SCHEDULED_FOR_DELIVERY`, `OUT_FOR_DELIVERY`, `DELAYED`
- Sort by created date, status
- Pagination

**Detail view (`/packages/:id`):**
- All package fields
- Current sealed bag (if assigned) with link to bag detail
- Scan log history — chronological timeline showing each status change with region, timestamp, and notes
- If status is `DELAYED`, show a prominent highlighted banner

---

### 4.3 Vehicles

**Route:** `/vehicles`

**Purpose:** Manage the vehicle fleet and monitor assignment status.

**List view:**
- Table columns: Vehicle Number, Capacity (kg), Current Journey (if any), Journey Status (chip)
- Search by vehicle number
- Filter by availability: All / Available (no active journey) / On Journey
- Sort by vehicle number, capacity
- Pagination

**Add vehicle:**
- Modal or drawer form
- Fields: Vehicle Number (number, required), Capacity in kg (number, required)
- Inline validation

**Detail view (`/vehicles/:id`):**
- Vehicle fields
- Current active journey (if any) — with route, departure time, delay status
- Past journeys list — sortable by date
- Current sealed bags loaded on vehicle — with bag ID, from/to regions, item count, weight

---

### 4.4 External Businesses

**Route:** `/businesses`

**Purpose:** View sender businesses whose packages are in the system.

**List view:**
- Table columns: Name, Code, Address
- Search by name or code
- Sort by name
- Pagination

**Detail view (`/businesses/:id`):**
- Business fields
- List of packages sent by this business — filterable by status

---

### 4.5 Sealed Bags

**Route:** `/bags`

**Purpose:** Manage sealed bags — create, assign packages, seal, load onto vehicles.

**List view:**
- Table columns: Bag ID, From Region, To Region, Status (chip), Item Count, Weight (kg), Vehicle (if assigned)
- Filter by status: `OPEN`, `SEALED`, `LOADED`, `IN_TRANSIT`, `ARRIVED`
- Filter by from/to region
- Sort by status, weight, created date
- Pagination

**Detail view (`/bags/:id`):**
- Bag fields and status
- Packages in this bag — table with package code, status, to-address
- Ability to add packages to the bag (when status is `OPEN`)
- Seal bag action (status `OPEN` → `SEALED`) — requires confirmation
- Assign to vehicle action (status `SEALED` → `LOADED`) — opens a vehicle selector showing only available vehicles with remaining capacity
- If vehicle is assigned, show vehicle number and link to vehicle detail

**Status chip colours (suggested):**
- `OPEN` → blue
- `SEALED` → amber
- `LOADED` → purple
- `IN_TRANSIT` → indigo
- `ARRIVED` → green

---

### 4.6 Routes

**Route:** `/routes`

**Purpose:** View and manage predefined routes between regional hubs.

**List view:**
- Table columns: Route Name, Route Code, Number of Stops
- Search by name or code
- Sort by name
- Pagination

**Detail view (`/routes/:id`):**
- Route name and code
- Ordered list of stops — showing stop number, region name, region code
- List of journeys that have used this route — sortable by date

---

### 4.7 Journeys

**Route:** `/journeys`

**Purpose:** Create and manage vehicle journeys along routes.

**List view:**
- Table columns: Journey ID, Vehicle Number, Route Name, Status (chip), Scheduled Departure, Actual Departure, Delayed (boolean chip)
- Filter by status: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- Filter by vehicle
- Filter by route
- Sort by scheduled departure, status
- Pagination

**Create journey:**
- Modal or drawer form
- Fields:
  - Vehicle (searchable select — shows only unassigned vehicles)
  - Route (searchable select)
  - Is Local (toggle — for pickup runs vs inter-hub transit)
  - Scheduled Departure (date-time picker)
- On submit: creates journey with status `SCHEDULED`

**Detail view (`/journeys/:id`):**
- All journey fields
- If delayed: show delay reason and next scheduled departure prominently in a warning banner
- Sealed bags on this vehicle — table with bag ID, from/to regions, weight, item count
- Action buttons based on current status:
  - `SCHEDULED` → **Start Journey** (sets status to `IN_PROGRESS`, records actual departure)
  - `SCHEDULED` or `IN_PROGRESS` → **Mark as Delayed** (opens modal to enter delay reason and next departure time)
  - `IN_PROGRESS` → **Complete Journey**
  - `SCHEDULED` → **Cancel Journey**
- All actions require confirmation dialogs

**Status chip colours (suggested):**
- `SCHEDULED` → blue
- `IN_PROGRESS` → indigo
- `COMPLETED` → green
- `CANCELLED` → grey
- `DELAYED` → red

---

### 4.8 Tracking Page

**Route:** `/tracking`

**Purpose:** Visual map-based view of the logistics network showing region hubs, active routes, and vehicle positions.

> **Design reference:** Use the Figma tracking page frame as the skeletal layout reference. Improve upon the layout — the Figma is a starting point, not a final spec.

#### 4.8.1 Map

- Use **Leaflet.js** with **OpenStreetMap** tiles — open source, free, no API key required
- Map centred on the geographic midpoint of all seeded regions on load
- Each region hub rendered as a **marker** at its coordinates (`locationLatitude`, `locationLongitude`)

**Region marker behaviour:**
- Default state: solid circular marker in brand colour with region code label
- Hover: tooltip popup showing:
  - Region name
  - Region code
  - Number of packages currently in this region
  - Number of active journeys passing through

**Vehicle on map:**
- When a sealed bag is assigned to a vehicle and that vehicle is on an active journey (`IN_PROGRESS`), show a **vehicle icon** on the map
- Vehicle position: midpoint between the `fromRegion` and `toRegion` of the sealed bag currently loaded
- Calculate midpoint from the two region coordinates: `((lat1+lat2)/2, (lng1+lng2)/2)`
- Vehicle icon: a distinct truck/van SVG marker, different from region markers
- Hover tooltip showing:
  - Vehicle number
  - Route name and code
  - Current journey status
  - Is delayed (yes/no) and delay reason if applicable
  - Bags loaded count

**Route lines:**
- When a journey is `IN_PROGRESS`, draw a polyline connecting the route stops in order using their region coordinates
- Line style: dashed, brand accent colour, medium weight
- No route lines for `SCHEDULED` or `COMPLETED` journeys

#### 4.8.2 Side Panel

- Alongside the map, show a scrollable panel listing:
  - Active journeys (status `IN_PROGRESS`) — vehicle number, route, departure time, delay indicator
  - Delayed journeys — vehicle number, delay reason, next departure
- Clicking a journey in the panel highlights the corresponding vehicle marker on the map

#### 4.8.3 Map Library

- **Leaflet.js** — install via `npm install leaflet`
- React wrapper: `react-leaflet` — install via `npm install react-leaflet`
- Tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Attribution: `© OpenStreetMap contributors` (required by OSM licence)
- No API key needed. Safe, legitimate, and free for this use case.

---

## 5. Navigation Structure

```
Sidebar navigation:
  Packages
  Sealed Bags
  Vehicles
  Journeys
  Routes
  Regions
  External Businesses
  Tracking          ← map view
```

- Active route highlighted in sidebar
- Sidebar collapsible on smaller screens
- Top bar shows current page title

---

## 6. API Integration Notes

- All list endpoints support `?page=`, `?limit=`, `?search=`, `?sortBy=`, `?sortOrder=asc|desc`
- Status update actions call `PATCH` endpoints — not full `PUT` replacements
- All timestamps come from the API in ISO 8601 UTC — convert to local time in the frontend
- Handle `404` (entity not found) and `409` (conflict — e.g. vehicle already on journey) error responses explicitly with user-facing messages

---

## 7. Out of Scope for Stage 2 Frontend

- Authentication and login (no user/staff model in Stage 2)
- Public package tracking (lives in Stage 1 frontend)
- Local delivery management (out of scope per requirements)
- Real-time updates / websockets (polling or manual refresh is acceptable)
- Mobile-first layout (desktop-first is sufficient for a back-office tool)
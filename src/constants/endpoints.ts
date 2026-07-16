export const HEALTH = '/health';

export const REGIONS = '/regions';
export const REGION = (id: string) => `/regions/${id}`;

export const PACKAGES = '/packages';
export const PACKAGE = (code: string) => `/packages/${encodeURIComponent(code)}`;
export const PACKAGE_SCAN_LOGS = (code: string) =>
    `/packages/${encodeURIComponent(code)}/scan-logs`;

export const EXTERNAL_BUSINESSES = '/external-businesses';

export const SEALED_BAGS = '/sealed-bags';
export const SEALED_BAG = (id: string) => `/sealed-bags/${id}`;

export const VEHICLES = '/vehicles';
export const UNASSIGNED_VEHICLES = '/vehicles/unassigned';
export const VEHICLE = (id: string) => `/vehicles/${id}`;

export const JOURNEYS = '/journeys';
export const JOURNEY = (id: string) => `/journeys/${id}`;

export const ROUTES = '/routes';
export const ROUTE_STOPS = '/routes/stops';
export const ROUTE = (id: string) => `/routes/${id}`;
export const ROUTE_WITH_STOPS = (id: string) => `/routes/${id}/stops`;

export const SIMULATION_STATUS = '/simulation/status';
export const SIMULATION_TICK = '/simulation/tick';

export const ROUTE_ROAD = '/routes/road-route';

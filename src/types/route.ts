import { Region } from './region';

export type Route = {
    id: string;
    name: string;
    code: string;
};

export type CreateRoutePayload = {
    name: string;
    code: string;
};

export type AddRouteStopPayload = {
    routeId: string;
    regionId: string;
    stopOrder: number;
};

export type RouteStop = {
    id: string;
    stopOrder: number;
    routeId: string;
    regionId: string;
    region: Region;
};

export type RouteWithStops = Route & {
    stops: RouteStop[];
};

export type RouteListRow = Route & {
    stopCount: number;
    stopSummary: string;
};

export type RoadRouteGeoJson = {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      geometry: {
        type: 'LineString';
        coordinates: [number, number][]; // [lng, lat]
      };
      properties: {
        summary?: {
          distance: number; // meters
          duration: number; // seconds
        };
        // ORS may include segments, etc.
        [key: string]: unknown;
      };
    }>;
  };

export type FetchRoadRoutePayload = {
    routeId: string;
    fromRegionId?: string;
    toRegionId?: string;
};

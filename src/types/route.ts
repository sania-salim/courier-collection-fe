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

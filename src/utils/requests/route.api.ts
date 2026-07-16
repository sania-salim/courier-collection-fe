import {
    ROUTE_STOPS,
    ROUTE_WITH_STOPS,
    ROUTES,
    ROUTE_ROAD,
} from '@/constants/endpoints';
import {
    AddRouteStopPayload,
    CreateRoutePayload,
    FetchRoadRoutePayload,
    RoadRouteGeoJson,
    Route,
    RouteStop,
    RouteWithStops,
} from '@/types/route';
import { get, post } from '@/utils/apiUtils';

export const fetchRoutes = () => get<Route[]>(ROUTES);

export const fetchRouteWithStops = (id: string) =>
    get<RouteWithStops>(ROUTE_WITH_STOPS(id));

export const createRoute = (payload: CreateRoutePayload) =>
    post<Route>(ROUTES, payload);

export const addRouteStop = (payload: AddRouteStopPayload) =>
    post<RouteStop>(ROUTE_STOPS, payload);

export const fetchRouteRoad = (payload: FetchRoadRoutePayload) =>
    post<RoadRouteGeoJson>(ROUTE_ROAD, payload);

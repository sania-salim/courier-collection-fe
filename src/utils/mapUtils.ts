import { RoadRouteGeoJson } from "@/types/route";

// e.g. utils/mapUtils.ts
export function geoJsonLineToLeafletPositions(
    geojson: RoadRouteGeoJson
): [number, number][] {
    const coords = geojson.features?.[0]?.geometry?.coordinates ?? [];
    return coords.map(([lng, lat]) => [lat, lng]);
}
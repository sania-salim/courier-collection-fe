import { RoadRouteGeoJson } from '@/types/route';

const EARTH_RADIUS_M = 6_371_000;

function haversineMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

/** Returns Leaflet [lat, lng] at fraction along the first LineString, or null. */
export function getPointAlongGeoJson(
    geojson: RoadRouteGeoJson,
    fraction: number
): [number, number] | null {
    const coords = geojson.features?.[0]?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;

    const segmentLengths: number[] = [];
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        const [lng1, lat1] = coords[i];
        const [lng2, lat2] = coords[i + 1];
        const len = haversineMeters(lat1, lng1, lat2, lng2);
        segmentLengths.push(len);
        total += len;
    }

    if (total <= 0) return null;

    const target = Math.min(1, Math.max(0, fraction)) * total;
    let walked = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
        const seg = segmentLengths[i];
        if (walked + seg >= target) {
            const t = seg === 0 ? 0 : (target - walked) / seg;
            const [lng1, lat1] = coords[i];
            const [lng2, lat2] = coords[i + 1];
            return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t];
        }
        walked += seg;
    }

    const [lng, lat] = coords[coords.length - 1];
    return [lat, lng];
}

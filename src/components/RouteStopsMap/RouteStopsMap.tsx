import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import {
    CircleMarker,
    GeoJSON,
    MapContainer,
    Polyline,
    TileLayer,
    Tooltip,
    useMap,
} from 'react-leaflet';
import { Region } from '@/types/region';
import { RoadRouteGeoJson } from '@/types/route';
import { fetchRouteRoad } from '@/utils/requests/route.api';
import 'leaflet/dist/leaflet.css';

type RouteStopsMapProps = {
    regions: Region[];
    routeId?: string;
    height?: number | string;
};

const STOP_COLORS = ['#0d9488', '#6366f1', '#6366f1', '#22c55e'];

const getStopColor = (index: number, total: number) => {
    if (index === 0) return STOP_COLORS[0];
    if (index === total - 1) return STOP_COLORS[3];
    return STOP_COLORS[1];
};

const FitBounds = ({ positions }: { positions: [number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        if (positions.length === 0) return;
        if (positions.length === 1) {
            map.setView(positions[0], 8);
            return;
        }
        map.fitBounds(positions, { padding: [40, 40] });
    }, [map, positions]);

    return null;
};

const RouteStopsMap = ({
    regions,
    routeId,
    height = 280,
}: RouteStopsMapProps) => {
    const [roadPath, setRoadPath] = useState<RoadRouteGeoJson | null>(null);

    const positions = useMemo<[number, number][]>(
        () =>
            regions.map((region) => [
                region.locationLatitude,
                region.locationLongitude,
            ]),
        [regions]
    );

    useEffect(() => {
        if (!routeId || regions.length < 2) {
            console.log('[RouteStopsMap] Skipping road fetch', {
                routeId,
                stopCount: regions.length,
            });
            setRoadPath(null);
            return;
        }

        let cancelled = false;

        console.log('[RouteStopsMap] Fetching road route for', routeId);
        fetchRouteRoad({ routeId })
            .then((res) => {
                if (cancelled) return;
                const geojson = res.data;
                const geometry = geojson.features?.[0]?.geometry;
                console.log('[RouteStopsMap] Road route fetched', {
                    routeId,
                    type: geojson.type,
                    geometry,
                    summary: geojson.features?.[0]?.properties?.summary,
                });
                setRoadPath(geojson);
            })
            .catch((err) => {
                console.error('[RouteStopsMap] Road route fetch failed', err);
                if (!cancelled) setRoadPath(null);
            });

        return () => {
            cancelled = true;
        };
    }, [routeId, regions]);

    const center: [number, number] =
        positions.length > 0 ? positions[0] : [20.5937, 78.9629];

    return (
        <Box
            sx={{
                height,
                borderRadius: 2,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
            }}
        >
            <MapContainer
                center={center}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution="© OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds positions={positions} />
                {!roadPath && positions.length >= 2 && (
                    <Polyline
                        positions={positions}
                        pathOptions={{
                            color: '#6366f1',
                            weight: 4,
                            dashArray: '8 8',
                        }}
                    />
                )}
                {roadPath && (
                    <GeoJSON
                        key={routeId}
                        data={roadPath}
                        style={{ color: '#6366f1', weight: 4 }}
                    />
                )}
                {regions.map((region, index) => (
                    <CircleMarker
                        key={region.id}
                        center={positions[index]}
                        radius={10}
                        pathOptions={{
                            color: getStopColor(index, regions.length),
                            fillColor: getStopColor(index, regions.length),
                            fillOpacity: 1,
                        }}
                    >
                        <Tooltip direction="top">
                            {`${index + 1}. ${region.name} (${region.regionCode})`}
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        </Box>
    );
};

export default RouteStopsMap;

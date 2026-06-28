import { useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import {
    CircleMarker,
    MapContainer,
    Polyline,
    TileLayer,
    Tooltip,
    useMap,
} from 'react-leaflet';
import { Region } from '@/types/region';
import 'leaflet/dist/leaflet.css';

type RouteStopsMapProps = {
    regions: Region[];
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

const RouteStopsMap = ({ regions, height = 280 }: RouteStopsMapProps) => {
    const positions = useMemo<[number, number][]>(
        () =>
            regions.map((region) => [
                region.locationLatitude,
                region.locationLongitude,
            ]),
        [regions]
    );

    const center: [number, number] =
        positions.length > 0
            ? positions[0]
            : [20.5937, 78.9629];

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
                {positions.length >= 2 && (
                    <Polyline
                        positions={positions}
                        pathOptions={{
                            color: '#6366f1',
                            weight: 4,
                            dashArray: '8 8',
                        }}
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

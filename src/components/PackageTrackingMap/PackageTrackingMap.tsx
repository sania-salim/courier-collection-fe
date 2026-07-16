import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { GeoJSON, MapContainer, Polyline, TileLayer } from 'react-leaflet';
import PositionTruck, {
    JourneyWithStops,
} from '@/components/PositionTruck/PositionTruck';
import RegionMapMarker from '@/components/RegionMapMarker/RegionMapMarker';
import { PackageStatus } from '@/types/package';
import { Region } from '@/types/region';
import { RoadRouteGeoJson } from '@/types/route';
import { fetchRouteRoad } from '@/utils/requests/route.api';
import 'leaflet/dist/leaflet.css';

type PackageTrackingMapProps = {
    fromRegion: Region;
    toRegion: Region;
    currentRegion?: Region;
    currentRegionId: string;
    routeId?: string | null;
    packageStatus: PackageStatus;
    journey: JourneyWithStops | null;
};

const PackageTrackingMap = ({
    fromRegion,
    toRegion,
    currentRegion,
    currentRegionId,
    routeId,
    packageStatus,
    journey,
}: PackageTrackingMapProps) => {
    const [roadPath, setRoadPath] = useState<RoadRouteGeoJson | null>(null);

    const from: [number, number] = [
        fromRegion.locationLatitude,
        fromRegion.locationLongitude,
    ];
    const to: [number, number] = [
        toRegion.locationLatitude,
        toRegion.locationLongitude,
    ];
    const center: [number, number] = [
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2,
    ];

    useEffect(() => {
        if (!routeId) {
            setRoadPath(null);
            return;
        }

        let cancelled = false;

        fetchRouteRoad({
            routeId,
            fromRegionId: fromRegion.id,
            toRegionId: toRegion.id,
        })
            .then((res) => {
                if (!cancelled) setRoadPath(res.data);
            })
            .catch(() => {
                if (!cancelled) setRoadPath(null);
            });

        return () => {
            cancelled = true;
        };
    }, [routeId, fromRegion.id, toRegion.id]);

    const isAtFrom = currentRegionId === fromRegion.id;
    const isAtTo = currentRegionId === toRegion.id;

    const fromColor = isAtFrom ? '#6366f1' : '#0f766e';
    const toColor = isAtTo ? '#6366f1' : '#22c55e';

    return (
        <Box
            sx={{
                height: { xs: 360, md: '100%' },
                minHeight: 360,
                overflow: 'hidden',
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
                {roadPath ? (
                    <GeoJSON
                        key={routeId ?? 'road'}
                        data={roadPath}
                        style={{ color: '#6366f1', weight: 4 }}
                    />
                ) : (
                    <Polyline
                        positions={[from, to]}
                        pathOptions={{
                            color: '#6366f1',
                            weight: 4,
                            dashArray: '8 8',
                        }}
                    />
                )}
                <RegionMapMarker
                    position={from}
                    color={fromColor}
                    label={`${fromRegion.name} (${fromRegion.regionCode})${
                        isAtFrom ? ' — current location' : ''
                    }`}
                />
                <RegionMapMarker
                    position={to}
                    color={toColor}
                    label={`${toRegion.name} (${toRegion.regionCode})${
                        isAtTo ? ' — current location' : ''
                    }`}
                />
                <PositionTruck
                    packageStatus={packageStatus}
                    fromRegion={fromRegion}
                    toRegion={toRegion}
                    currentRegion={currentRegion}
                    journey={journey}
                />
            </MapContainer>
        </Box>
    );
};

export default PackageTrackingMap;

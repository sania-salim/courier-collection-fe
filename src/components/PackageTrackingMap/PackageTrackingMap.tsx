import { Box } from '@mui/material';
import {
    MapContainer,
    Polyline,
    CircleMarker,
    TileLayer,
    Tooltip,
} from 'react-leaflet';
import { Region } from '@/types/region';
import 'leaflet/dist/leaflet.css';

type PackageTrackingMapProps = {
    fromRegion: Region;
    toRegion: Region;
    currentRegion?: Region;
    currentRegionId: string;
};

const PackageTrackingMap = ({
    fromRegion,
    toRegion,
    currentRegion,
    currentRegionId,
}: PackageTrackingMapProps) => {
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

    const isAtFrom = currentRegionId === fromRegion.id;
    const isAtTo = currentRegionId === toRegion.id;
    const isAtIntermediate =
        currentRegion &&
        !isAtFrom &&
        !isAtTo &&
        currentRegionId === currentRegion.id;

    const inTransitBetweenEndpoints =
        !isAtFrom && !isAtTo && !isAtIntermediate;

    const currentMarker: [number, number] | null = isAtFrom
        ? from
        : isAtTo
          ? to
          : isAtIntermediate
            ? [
                  currentRegion.locationLatitude,
                  currentRegion.locationLongitude,
              ]
            : inTransitBetweenEndpoints
              ? [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
              : null;

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
                <Polyline
                    positions={[from, to]}
                    pathOptions={{
                        color: '#6366f1',
                        weight: 4,
                        dashArray: '8 8',
                    }}
                />
                <CircleMarker
                    center={from}
                    radius={10}
                    pathOptions={{
                        color: isAtFrom ? '#6366f1' : '#0d9488',
                        fillColor: isAtFrom ? '#6366f1' : '#0d9488',
                        fillOpacity: 1,
                    }}
                >
                    <Tooltip direction="top">
                        {`${fromRegion.name} (${fromRegion.regionCode})`}
                        {isAtFrom ? ' — current location' : ''}
                    </Tooltip>
                </CircleMarker>
                <CircleMarker
                    center={to}
                    radius={10}
                    pathOptions={{
                        color: isAtTo ? '#6366f1' : '#22c55e',
                        fillColor: isAtTo ? '#6366f1' : '#22c55e',
                        fillOpacity: 1,
                    }}
                >
                    <Tooltip direction="top">
                        {`${toRegion.name} (${toRegion.regionCode})`}
                        {isAtTo ? ' — current location' : ''}
                    </Tooltip>
                </CircleMarker>
                {isAtIntermediate && currentMarker ? (
                    <CircleMarker
                        center={currentMarker}
                        radius={10}
                        pathOptions={{
                            color: '#6366f1',
                            fillColor: '#6366f1',
                            fillOpacity: 1,
                        }}
                    >
                        <Tooltip direction="top">
                            {`${currentRegion.name} (${currentRegion.regionCode}) — current location`}
                        </Tooltip>
                    </CircleMarker>
                ) : null}
                {inTransitBetweenEndpoints && currentMarker ? (
                    <CircleMarker
                        center={currentMarker}
                        radius={8}
                        pathOptions={{
                            color: '#6366f1',
                            fillColor: '#6366f1',
                            fillOpacity: 0.9,
                        }}
                    >
                        <Tooltip direction="top">
                            In transit between regions
                        </Tooltip>
                    </CircleMarker>
                ) : null}
            </MapContainer>
        </Box>
    );
};

export default PackageTrackingMap;

import { useEffect, useMemo, useState } from 'react';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Marker, Tooltip } from 'react-leaflet';
import { useLeafletReactIcon } from '@/hooks/useLeafletReactIcon';
import { Journey } from '@/types/journey';
import { PackageStatus } from '@/types/package';
import { Region } from '@/types/region';
import { RouteStop } from '@/types/route';
import { fetchRouteRoad } from '@/utils/requests/route.api';
import { getPointAlongGeoJson } from './geoJsonPath';
import TruckHoverCard from './TruckHoverCard';

export type JourneyWithStops = Journey & {
    route?: (Journey['route'] & { stops?: RouteStop[] }) | null;
};

type PositionTruckProps = {
    packageStatus: PackageStatus;
    fromRegion: Region;
    toRegion: Region;
    currentRegion?: Region;
    journey: JourneyWithStops | null;
};

type TruckPlacement = {
    position: [number, number];
    flipHorizontal: boolean;
};

/** Magenta outlined truck — high contrast on map tiles. */
const TRUCK_COLOR = '#b00558';

function getNextStopRegion(
    stops: RouteStop[],
    afterRegionId: string
): Region | null {
    const currentOrder = stops.find(
        (stop) => stop.regionId === afterRegionId
    )?.stopOrder;
    if (currentOrder == null) return null;

    const next = stops
        .filter((stop) => stop.stopOrder > currentOrder)
        .sort((a, b) => a.stopOrder - b.stopOrder)[0];

    return next?.region ?? null;
}

/** MUI LocalShipping faces west (left). Flip when heading east. */
function shouldFlipForDestination(
    truckLng: number,
    destinationLng: number
): boolean {
    return destinationLng > truckLng;
}

const PositionTruck = ({
    packageStatus,
    fromRegion,
    toRegion,
    currentRegion,
    journey,
}: PositionTruckProps) => {
    const [enRoutePlacement, setEnRoutePlacement] =
        useState<TruckPlacement | null>(null);

    const stops = journey?.route?.stops ?? [];
    const isEnRoute = packageStatus === 'EN_ROUTE_TO_REGION';
    const lastHubId = journey?.currentRegionId ?? currentRegion?.id ?? null;

    const nextHub = useMemo(() => {
        if (!lastHubId || stops.length === 0) return toRegion;
        return getNextStopRegion(stops, lastHubId) ?? toRegion;
    }, [lastHubId, stops, toRegion]);

    const lastHub = useMemo(() => {
        if (!lastHubId) return currentRegion ?? null;
        const fromStops = stops.find((s) => s.regionId === lastHubId)?.region;
        if (fromStops) return fromStops;
        if (currentRegion?.id === lastHubId) return currentRegion;
        return null;
    }, [lastHubId, stops, currentRegion]);

    useEffect(() => {
        if (!isEnRoute) {
            setEnRoutePlacement(null);
            return;
        }

        if (!journey?.routeId || !lastHub || !nextHub) {
            setEnRoutePlacement(null);
            return;
        }

        let cancelled = false;

        fetchRouteRoad({
            routeId: journey.routeId,
            fromRegionId: lastHub.id,
            toRegionId: nextHub.id,
        })
            .then((res) => {
                if (cancelled) return;
                const midpoint = getPointAlongGeoJson(res.data, 0.5);
                if (!midpoint) {
                    setEnRoutePlacement(null);
                    return;
                }
                setEnRoutePlacement({
                    position: midpoint,
                    flipHorizontal: shouldFlipForDestination(
                        midpoint[1],
                        nextHub.locationLongitude
                    ),
                });
            })
            .catch(() => {
                if (!cancelled) setEnRoutePlacement(null);
            });

        return () => {
            cancelled = true;
        };
    }, [isEnRoute, journey?.routeId, lastHub, nextHub]);

    const atHubPlacement = useMemo((): TruckPlacement | null => {
        if (isEnRoute || !currentRegion) return null;
        return {
            position: [
                currentRegion.locationLatitude,
                currentRegion.locationLongitude,
            ],
            flipHorizontal: shouldFlipForDestination(
                currentRegion.locationLongitude,
                toRegion.locationLongitude
            ),
        };
    }, [isEnRoute, currentRegion, toRegion]);

    const placement = isEnRoute ? enRoutePlacement : atHubPlacement;

    const canShow =
        Boolean(journey?.vehicle) &&
        packageStatus !== 'TO_BE_PICKED_UP' &&
        placement != null;

    const flipHorizontal = placement?.flipHorizontal ?? false;

    const icon = useLeafletReactIcon(
        canShow ? (
            <LocalShippingOutlinedIcon
                sx={{
                    fontSize: 32,
                    color: TRUCK_COLOR,
                    transform: flipHorizontal ? 'scaleX(-1)' : 'none',
                    filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45))',
                    display: 'block',
                }}
            />
        ) : null,
        [canShow, flipHorizontal],
        { size: [36, 36], anchor: [18, 18], className: 'position-truck-icon' }
    );

    if (!canShow || !placement || !icon || !journey?.vehicle) {
        return null;
    }

    return (
        <Marker
            key={flipHorizontal ? 'truck-flipped' : 'truck-default'}
            position={placement.position}
            icon={icon}
        >
            <Tooltip
                direction="top"
                opacity={1}
                offset={[0, -12]}
                className="position-truck-tooltip"
            >
                <TruckHoverCard
                    vehicleNumber={journey.vehicle.vehicleNumber}
                    journeyId={journey.id}
                    routeCode={journey.route?.code ?? '—'}
                    fromLabel={`${fromRegion.name} (${fromRegion.regionCode})`}
                    toLabel={`${toRegion.name} (${toRegion.regionCode})`}
                />
            </Tooltip>
        </Marker>
    );
};

export default PositionTruck;

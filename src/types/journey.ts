import { Route } from './route';
import { Vehicle } from './vehicle';

export type JourneyStatus =
    | 'SCHEDULED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';

export type CreateJourneyPayload = {
    vehicleId: string;
    routeId: string;
    isLocal: boolean;
    scheduledDepartureAt: string;
};

export type Journey = {
    id: string;
    isLocal: boolean;
    status: JourneyStatus;
    vehicleId: string | null;
    routeId: string | null;
    currentRegionId: string | null;
    nextArrivalAt: string | null;
    scheduledDepartureAt: string | null;
    nextDepartureAt: string | null;
    actualDepartureAt: string | null;
    isDelayed: boolean;
    delayReason: string | null;
    vehicle?: Vehicle | null;
    route?: Route | null;
};

export type JourneyListRow = Journey;

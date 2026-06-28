import { BagStatus } from '@/types/sealedBag';
import { PackageStatus } from '@/types/package';
import { JourneyStatus } from '@/types/journey';

export const PACKAGE_STATUSES: PackageStatus[] = [
    'TO_BE_PICKED_UP',
    'PICKED_UP',
    'ADDED_TO_BAG',
    'EN_ROUTE_TO_REGION',
    'ARRIVED_AT_REGION',
    'SCHEDULED_FOR_DELIVERY',
    'OUT_FOR_DELIVERY',
    'DELAYED',
];

export const STATUS_LABELS: Record<PackageStatus, string> = {
    TO_BE_PICKED_UP: 'To Be Picked Up',
    PICKED_UP: 'Picked Up',
    ADDED_TO_BAG: 'Added to Bag',
    EN_ROUTE_TO_REGION: 'En Route to Region',
    ARRIVED_AT_REGION: 'Arrived at Region',
    SCHEDULED_FOR_DELIVERY: 'Scheduled for Delivery',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELAYED: 'Delayed',
};

type StatusChipColor =
    | 'default'
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'secondary';

export const STATUS_CHIP_COLORS: Record<PackageStatus, StatusChipColor> = {
    TO_BE_PICKED_UP: 'default',
    PICKED_UP: 'info',
    ADDED_TO_BAG: 'info',
    EN_ROUTE_TO_REGION: 'warning',
    ARRIVED_AT_REGION: 'info',
    SCHEDULED_FOR_DELIVERY: 'secondary',
    OUT_FOR_DELIVERY: 'secondary',
    DELAYED: 'error',
};

export const STATUS_ORDER: PackageStatus[] = [
    'TO_BE_PICKED_UP',
    'PICKED_UP',
    'ADDED_TO_BAG',
    'EN_ROUTE_TO_REGION',
    'ARRIVED_AT_REGION',
    'SCHEDULED_FOR_DELIVERY',
    'OUT_FOR_DELIVERY',
];

export const getStatusLabel = (status: PackageStatus): string =>
    STATUS_LABELS[status] ?? status;

export const getStatusIndex = (status: PackageStatus): number => {
    if (status === 'DELAYED') {
        return STATUS_ORDER.indexOf('EN_ROUTE_TO_REGION');
    }
    const index = STATUS_ORDER.indexOf(status);
    return index >= 0 ? index : 0;
};

// Journey statuses
export const JOURNEY_STATUSES: JourneyStatus[] = [
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
];

export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

export const JOURNEY_STATUS_CHIP_COLORS: Record<JourneyStatus, StatusChipColor> =
    {
        SCHEDULED: 'info',
        IN_PROGRESS: 'secondary',
        COMPLETED: 'success',
        CANCELLED: 'default',
    };

export const getJourneyStatusLabel = (status: JourneyStatus): string =>
    JOURNEY_STATUS_LABELS[status] ?? status;

export const BAG_STATUSES: BagStatus[] = [
    'OPEN',
    'SEALED',
    'LOADED',
    'IN_TRANSIT',
    'ARRIVED',
];

export const BAG_STATUS_LABELS: Record<BagStatus, string> = {
    OPEN: 'Open',
    SEALED: 'Sealed',
    LOADED: 'Loaded',
    IN_TRANSIT: 'In Transit',
    ARRIVED: 'Arrived',
};

export const BAG_STATUS_CHIP_COLORS: Record<BagStatus, StatusChipColor> = {
    OPEN: 'default',
    SEALED: 'info',
    LOADED: 'warning',
    IN_TRANSIT: 'secondary',
    ARRIVED: 'success',
};

export const getBagStatusLabel = (status: BagStatus): string =>
    BAG_STATUS_LABELS[status] ?? status;

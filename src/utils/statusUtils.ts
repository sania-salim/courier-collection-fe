import { PackageStatus } from '@/types/package';

export const STATUS_LABELS: Record<PackageStatus, string> = {
    to_be_picked_up: 'To Be Picked Up',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    arrived: 'Arrived',
    delayed: 'Delayed',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
};

export const STATUS_ORDER: PackageStatus[] = [
    'to_be_picked_up',
    'picked_up',
    'in_transit',
    'arrived',
    'out_for_delivery',
    'delivered',
];

type StatusChipColor = 'default' | 'info' | 'warning' | 'error' | 'success' | 'secondary';

export const STATUS_CHIP_COLORS: Record<PackageStatus, StatusChipColor> = {
    to_be_picked_up: 'default',
    picked_up: 'info',
    in_transit: 'warning',
    arrived: 'info',
    delayed: 'error',
    out_for_delivery: 'secondary',
    delivered: 'success',
};

export const getStatusLabel = (status: PackageStatus): string =>
    STATUS_LABELS[status] ?? status;

export const getStatusIndex = (status: PackageStatus): number => {
    if (status === 'delayed') return STATUS_ORDER.indexOf('in_transit');
    return STATUS_ORDER.indexOf(status);
};

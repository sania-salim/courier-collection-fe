import { Journey, JourneyStatus } from '@/types/journey';

/** Format ISO date for `datetime-local` input (local timezone). */
export const toDateTimeLocalValue = (iso: string): string => {
    const date = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Convert `datetime-local` value to ISO string for the API. */
export const fromDateTimeLocalValue = (value: string): string =>
    new Date(value).toISOString();

const ACTIVE_STATUSES: JourneyStatus[] = ['SCHEDULED', 'IN_PROGRESS'];

export const getActiveJourneys = (journeys: Journey[]): Journey[] =>
    journeys.filter((j) => ACTIVE_STATUSES.includes(j.status));

export const getActiveJourneyForVehicle = (
    vehicleId: string,
    journeys: Journey[]
): Journey | undefined => {
    const active = journeys.filter(
        (j) =>
            j.vehicleId === vehicleId &&
            ACTIVE_STATUSES.includes(j.status)
    );

    return (
        active.find((j) => j.status === 'IN_PROGRESS') ??
        active.find((j) => j.status === 'SCHEDULED')
    );
};

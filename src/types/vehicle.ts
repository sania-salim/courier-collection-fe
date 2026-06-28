export type Vehicle = {
    id: string;
    vehicleNumber: number;
    capacity: number;
    isDelayed: boolean;
};

export type VehicleListRow = Vehicle & {
    currentJourneyId?: string;
    currentJourneyStatus?: import('./journey').JourneyStatus;
    currentRouteName?: string;
};

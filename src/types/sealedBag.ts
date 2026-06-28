export type BagStatus =
    | 'OPEN'
    | 'SEALED'
    | 'LOADED'
    | 'IN_TRANSIT'
    | 'ARRIVED';

export type SealedBag = {
    id: string;
    itemCount: number;
    weight: number;
    maxWeightKg: number;
    originRegionId: string;
    currentRegionId: string;
    toRegionId: string | null;
    routeId: string | null;
    vehicleId: string | null;
    status: BagStatus;
    timeArrivedAt: string | null;
    sealedAt: string | null;
    loadedAt: string | null;
};

export type SealedBagListRow = SealedBag & {
    originRegionLabel: string;
    currentRegionLabel: string;
    toRegionLabel: string;
    routeLabel: string;
    vehicleLabel: string;
};

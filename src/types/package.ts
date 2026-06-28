export type PackageStatus =
    | 'TO_BE_PICKED_UP'
    | 'PICKED_UP'
    | 'ADDED_TO_BAG'
    | 'EN_ROUTE_TO_REGION'
    | 'ARRIVED_AT_REGION'
    | 'SCHEDULED_FOR_DELIVERY'
    | 'OUT_FOR_DELIVERY'
    | 'DELAYED';

export type CourierPackage = {
    id: string;
    code: string;
    fromRegionId: string;
    toRegionId: string;
    currentRegionId: string;
    fromAddressId: string;
    toAddress: string;
    weight: number;
    status: PackageStatus;
    sealedBagId: string | null;
    createdAt: string;
    pickedUpAt: string | null;
};

export type PackageListRow = CourierPackage & {
    fromRegionName?: string;
    currentRegionName?: string;
    sealedBagLabel?: string;
};

export type CreatePackagePayload = {
    code: string;
    fromRegionId: string;
    toRegionId: string;
    fromAddressId: string;
    toAddress: string;
    weight?: number;
};

export type PackageScanLog = {
    id: string;
    packageId: string;
    regionId: string;
    status: PackageStatus;
    notes: string | null;
    scannedAt: string;
    region: {
        id: string;
        name: string;
        regionCode: string;
    };
};

export type PackageStatus =
    | 'to_be_picked_up'
    | 'picked_up'
    | 'in_transit'
    | 'arrived'
    | 'delayed'
    | 'out_for_delivery'
    | 'delivered';

export type Package = {
    id: string;
    tracking_id: string;
    front_office_id: string;
    to_name: string;
    to_address: string;
    to_region_id: string;
    weight: number | string;
    current_status: PackageStatus;
    current_region_id: string;
    created_at: string;
    updated_at: string;
};

export type TrackingDetails = {
    tracking_id: string;
    current_status: PackageStatus;
    current_region: string;
    to_name: string;
    to_address: string;
};

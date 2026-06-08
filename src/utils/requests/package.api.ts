import { PACKAGE_TRACKING, PACKAGES } from '@/constants/endpoints';
import { Package, TrackingDetails } from '@/types/package';
import { get } from '@/utils/apiUtils';

export const fetchPackages = () => {
    return get<Package[]>(PACKAGES);
};

export const fetchTrackingDetails = (trackingId: string) => {
    return get<TrackingDetails>(PACKAGE_TRACKING(trackingId));
};

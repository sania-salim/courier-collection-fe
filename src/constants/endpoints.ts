export const PACKAGES = '/packages';
export const PACKAGE_TRACKING = (trackingId: string) =>
    `/packages/tracking/${trackingId}`;
export const PACKAGE_STATUS = (id: string) => `/packages/${id}/status`;

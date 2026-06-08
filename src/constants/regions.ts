/** Placeholder region map until regions API is available in a future phase. */
export const REGION_MAP: Record<string, string> = {
    'a0000001-0000-4000-8000-000000000001': 'Northern Hub',
    'a0000001-0000-4000-8000-000000000002': 'Southern Hub',
    'a0000001-0000-4000-8000-000000000003': 'Eastern Hub',
    'a0000001-0000-4000-8000-000000000004': 'Western Hub',
    'a0000001-0000-4000-8000-000000000005': 'Central Hub',
};

export const getRegionName = (regionId: string): string =>
    REGION_MAP[regionId] ?? regionId.slice(0, 8) + '…';

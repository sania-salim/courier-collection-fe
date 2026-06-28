const paths = {
    ROOT_PATH: '/',
    ERROR_PATH: '/error',
    PACKAGES_PATH: '/packages',
    BAGS_PATH: '/bags',
    VEHICLES_PATH: '/vehicles',
    JOURNEYS_PATH: '/journeys',
    ROUTES_PATH: '/routes',
    REGIONS_PATH: '/regions',
    BUSINESSES_PATH: '/businesses',
    packageDetail: (code: string) =>
        `/packages/${encodeURIComponent(code)}`,
    bagDetail: (id: string) => `/bags/${id}`,
    regionDetail: (id: string) => `/regions/${id}`,
    vehicleDetail: (id: string) => `/vehicles/${id}`,
    journeyDetail: (id: string) => `/journeys/${id}`,
};

export const routeTitles: Record<string, string> = {
    [paths.PACKAGES_PATH]: 'Packages',
    [paths.BAGS_PATH]: 'Sealed Bags',
    [paths.VEHICLES_PATH]: 'Vehicles',
    [paths.JOURNEYS_PATH]: 'Journeys',
    [paths.ROUTES_PATH]: 'Routes',
    [paths.REGIONS_PATH]: 'Regions',
    [paths.BUSINESSES_PATH]: 'External Businesses',
    [paths.ROOT_PATH]: 'Home',
};

export const getPageTitle = (pathname: string): string => {
    if (pathname.startsWith(`${paths.PACKAGES_PATH}/`)) return 'Package Tracking';
    if (pathname.startsWith(`${paths.REGIONS_PATH}/`)) return 'Region Detail';
    if (pathname.startsWith(`${paths.VEHICLES_PATH}/`)) return 'Vehicle Detail';
    if (pathname.startsWith(`${paths.JOURNEYS_PATH}/`)) return 'Journey Detail';
    if (pathname.startsWith(`${paths.BAGS_PATH}/`)) return 'Sealed Bag Detail';

    for (const [path, title] of Object.entries(routeTitles)) {
        if (pathname === path) return title;
    }

    return 'Courier Collection';
};

export default paths;

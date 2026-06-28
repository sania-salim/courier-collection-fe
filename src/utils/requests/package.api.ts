import { PACKAGES, PACKAGE, PACKAGE_SCAN_LOGS } from '@/constants/endpoints';
import { CourierPackage, CreatePackagePayload, PackageScanLog } from '@/types/package';
import { get, post } from '@/utils/apiUtils';

export const fetchPackages = () => get<CourierPackage[]>(PACKAGES);

export const fetchPackage = (code: string) =>
    get<CourierPackage>(PACKAGE(code));

export const fetchPackageScanLogs = (code: string) =>
    get<PackageScanLog[]>(PACKAGE_SCAN_LOGS(code));

export const createPackage = (data: CreatePackagePayload) =>
    post<CourierPackage>(PACKAGES, data);

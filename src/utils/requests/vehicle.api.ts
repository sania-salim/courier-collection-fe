import { UNASSIGNED_VEHICLES, VEHICLES } from '@/constants/endpoints';
import { Vehicle } from '@/types/vehicle';
import { get } from '@/utils/apiUtils';

export const fetchVehicles = () => get<Vehicle[]>(VEHICLES);

export const fetchUnassignedVehicles = () =>
    get<Vehicle[]>(UNASSIGNED_VEHICLES);

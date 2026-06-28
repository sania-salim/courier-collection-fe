import { REGIONS } from '@/constants/endpoints';
import { Region } from '@/types/region';
import { get } from '@/utils/apiUtils';

export const fetchRegions = () => get<Region[]>(REGIONS);

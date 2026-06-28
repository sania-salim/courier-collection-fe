import { SEALED_BAGS } from '@/constants/endpoints';
import { SealedBag } from '@/types/sealedBag';
import { get } from '@/utils/apiUtils';

export const fetchSealedBags = () => get<SealedBag[]>(SEALED_BAGS);

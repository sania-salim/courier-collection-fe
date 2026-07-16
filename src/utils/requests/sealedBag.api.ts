import { SEALED_BAG, SEALED_BAGS } from '@/constants/endpoints';
import { SealedBag } from '@/types/sealedBag';
import { get } from '@/utils/apiUtils';

export const fetchSealedBags = () => get<SealedBag[]>(SEALED_BAGS);

export const fetchSealedBag = (id: string) => get<SealedBag>(SEALED_BAG(id));

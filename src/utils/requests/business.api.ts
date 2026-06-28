import { EXTERNAL_BUSINESSES } from '@/constants/endpoints';
import {
    CreateExternalBusinessPayload,
    ExternalBusiness,
} from '@/types/business';
import { get, post } from '@/utils/apiUtils';

export const fetchExternalBusinesses = () =>
    get<ExternalBusiness[]>(EXTERNAL_BUSINESSES);

export const createExternalBusiness = (data: CreateExternalBusinessPayload) =>
    post<ExternalBusiness>(EXTERNAL_BUSINESSES, data);

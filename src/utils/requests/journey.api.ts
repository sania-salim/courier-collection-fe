import { JOURNEYS } from '@/constants/endpoints';
import { CreateJourneyPayload, Journey } from '@/types/journey';
import { get, post } from '@/utils/apiUtils';

export const fetchJourneys = () => get<Journey[]>(JOURNEYS);

export const createJourney = (payload: CreateJourneyPayload) =>
    post<Journey>(JOURNEYS, payload);

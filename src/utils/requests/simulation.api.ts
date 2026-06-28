import {
    SIMULATION_STATUS,
    SIMULATION_TICK,
} from '@/constants/endpoints';
import {
    SimulationStatus,
    SimulationTickResult,
} from '@/types/simulation';
import { get, post } from '@/utils/apiUtils';

export const fetchSimulationStatus = () =>
    get<SimulationStatus>(SIMULATION_STATUS);

export const runSimulationTick = (force = true) =>
    post<SimulationTickResult>(
        `${SIMULATION_TICK}${force ? '?force=true' : '?force=false'}`,
        {}
    );

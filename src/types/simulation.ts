import { Journey } from './journey';

export type SimulationStatus = {
    enabled: boolean;
    intervalMs: number;
    jitterMs: number;
    now: string;
    activeJourneys: Journey[];
    dueCount: number;
};

export type SimulationTickResult = {
    processed: number;
    departures: number;
    arrivals: number;
    completed: number;
    errors: string[];
    steps: string[];
};

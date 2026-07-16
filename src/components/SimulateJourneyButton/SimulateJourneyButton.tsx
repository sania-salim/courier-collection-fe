import { Button, Tooltip } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { getActiveJourneys } from '@/utils/journeyUtils';
import { fetchJourneys } from '@/utils/requests/journey.api';
import { runSimulationTick } from '@/utils/requests/simulation.api';

/** Dispatched after a successful simulation tick so list pages can reload. */
export const SIMULATION_TICK_EVENT = 'courier:simulation-tick';

const SimulateJourneyButton = () => {
    const [hasActiveJourney, setHasActiveJourney] = useState(false);
    const [simulating, setSimulating] = useState(false);

    const refreshActiveJourneys = useCallback(() => {
        fetchJourneys()
            .then((res) => {
                setHasActiveJourney(getActiveJourneys(res.data).length > 0);
            })
            .catch(() => {
                setHasActiveJourney(false);
            });
    }, []);

    useEffect(() => {
        refreshActiveJourneys();
    }, [refreshActiveJourneys]);

    useEffect(() => {
        const onTick = () => refreshActiveJourneys();
        window.addEventListener(SIMULATION_TICK_EVENT, onTick);
        return () => window.removeEventListener(SIMULATION_TICK_EVENT, onTick);
    }, [refreshActiveJourneys]);

    const handleSimulateJourney = async () => {
        setSimulating(true);
        try {
            const { data } = await runSimulationTick(true);
            if (data.errors.length > 0) {
                toast.error(data.errors.join('; '));
            } else if (data.processed === 0) {
                toast.info(data.steps[0] ?? 'Nothing to simulate');
            } else {
                toast.success(data.steps.slice(0, 3).join('\n'), {
                    style: { whiteSpace: 'pre-line' },
                });
            }
            refreshActiveJourneys();
            window.dispatchEvent(new CustomEvent(SIMULATION_TICK_EVENT));
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Simulation failed'));
        } finally {
            setSimulating(false);
        }
    };

    return (
        <Tooltip
            title={
                hasActiveJourney
                    ? 'Advance the journey one step: bagging at hub, departure, or arrival'
                    : 'Create a journey (route + vehicle) on the Journeys page first'
            }
        >
            <span>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PlayArrow />}
                    disabled={!hasActiveJourney || simulating}
                    onClick={handleSimulateJourney}
                >
                    {simulating ? 'Simulating…' : 'Simulate journey'}
                </Button>
            </span>
        </Tooltip>
    );
};

export default SimulateJourneyButton;

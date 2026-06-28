import {
    Box,
    Button,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from '@mui/material';
import { Add, Timeline } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/Table/Table';
import { getJourneyListColumns } from '@/constants/GetJourneyListColumns';
import { JourneyListRow, JourneyStatus } from '@/types/journey';
import { Route } from '@/types/route';
import { Vehicle } from '@/types/vehicle';
import { getApiErrorMessage } from '@/utils/errorUtils';
import AddJourneyDialog from '@/pages/Journeys/AddJourneyDialog';
import { pageActionsSx, pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { fetchJourneys } from '@/utils/requests/journey.api';
import { fetchRoutes } from '@/utils/requests/route.api';
import { fetchVehicles } from '@/utils/requests/vehicle.api';
import {
    getJourneyStatusLabel,
    JOURNEY_STATUSES,
} from '@/utils/statusUtils';

const ALL_FILTER = '';

const JourneyList = () => {
    const [journeys, setJourneys] = useState<JourneyListRow[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<JourneyStatus[]>([]);
    const [vehicleFilter, setVehicleFilter] = useState(ALL_FILTER);
    const [routeFilter, setRouteFilter] = useState(ALL_FILTER);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const loadData = useCallback(() => {
        setLoading(true);
        Promise.all([fetchJourneys(), fetchVehicles(), fetchRoutes()])
            .then(([journeysRes, vehiclesRes, routesRes]) => {
                setJourneys(journeysRes.data);
                setVehicles(vehiclesRes.data);
                setRoutes(routesRes.data);
            })
            .catch((err) =>
                toast.error(getApiErrorMessage(err, 'Failed to load journeys'))
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredJourneys = useMemo(() => {
        return journeys.filter((journey) => {
            const matchesStatus =
                statusFilter.length === 0 ||
                statusFilter.includes(journey.status);
            const matchesVehicle =
                !vehicleFilter || journey.vehicleId === vehicleFilter;
            const matchesRoute =
                !routeFilter || journey.routeId === routeFilter;
            return matchesStatus && matchesVehicle && matchesRoute;
        });
    }, [journeys, statusFilter, vehicleFilter, routeFilter]);

    const columns = useMemo(() => getJourneyListColumns(), []);

    return (
        <Box sx={pageShellSx}>
            <Box sx={pageActionsSx}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAddDialogOpen(true)}
                >
                    Add journey
                </Button>
            </Box>

            <Card sx={pageCardSx}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3,
                        alignItems: 'flex-start',
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel id="journey-status-filter-label">
                            Status
                        </InputLabel>
                        <Select
                            labelId="journey-status-filter-label"
                            multiple
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value as JourneyStatus[])
                            }
                            input={<OutlinedInput label="Status" />}
                            renderValue={(selected) =>
                                selected.length === 0
                                    ? 'All statuses'
                                    : `${selected.length} selected`
                            }
                        >
                            {JOURNEY_STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {getJourneyStatusLabel(status)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="vehicle-filter-label">Vehicle</InputLabel>
                        <Select
                            labelId="vehicle-filter-label"
                            value={vehicleFilter}
                            label="Vehicle"
                            onChange={(e) => setVehicleFilter(e.target.value)}
                        >
                            <MenuItem value={ALL_FILTER}>All vehicles</MenuItem>
                            {vehicles.map((vehicle) => (
                                <MenuItem key={vehicle.id} value={vehicle.id}>
                                    #{vehicle.vehicleNumber}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="route-filter-label">Route</InputLabel>
                        <Select
                            labelId="route-filter-label"
                            value={routeFilter}
                            label="Route"
                            onChange={(e) => setRouteFilter(e.target.value)}
                        >
                            <MenuItem value={ALL_FILTER}>All routes</MenuItem>
                            {routes.map((route) => (
                                <MenuItem key={route.id} value={route.id}>
                                    {route.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <AddJourneyDialog
                    open={addDialogOpen}
                    onClose={() => setAddDialogOpen(false)}
                    onSuccess={loadData}
                />

                {!loading && filteredJourneys.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Timeline
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No journeys found
                        </Typography>
                        <Typography color="text.secondary">
                            {statusFilter.length > 0 ||
                            vehicleFilter ||
                            routeFilter
                                ? 'Try adjusting your filters.'
                                : 'No journeys found.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table
                        rows={filteredJourneys}
                        columns={columns}
                        loading={loading}
                    />
                )}
            </Card>
        </Box>
    );
};

export default JourneyList;

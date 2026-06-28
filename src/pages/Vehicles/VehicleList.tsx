import {
    Box,
    Card,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { LocalShipping, Search } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/Table/Table';
import { getVehicleListColumns } from '@/constants/GetVehicleListColumns';
import { VehicleListRow } from '@/types/vehicle';
import { pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { getActiveJourneyForVehicle } from '@/utils/journeyUtils';
import { fetchJourneys } from '@/utils/requests/journey.api';
import { fetchVehicles } from '@/utils/requests/vehicle.api';

type AvailabilityFilter = 'all' | 'available' | 'on_journey';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState<VehicleListRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [availabilityFilter, setAvailabilityFilter] =
        useState<AvailabilityFilter>('all');

    const loadData = useCallback(() => {
        setLoading(true);
        Promise.all([fetchVehicles(), fetchJourneys()])
            .then(([vehiclesRes, journeysRes]) => {
                setVehicles(
                    vehiclesRes.data.map((vehicle) => {
                        const activeJourney = getActiveJourneyForVehicle(
                            vehicle.id,
                            journeysRes.data
                        );
                        return {
                            ...vehicle,
                            currentJourneyId: activeJourney?.id,
                            currentJourneyStatus: activeJourney?.status,
                            currentRouteName: activeJourney?.route?.name,
                        };
                    })
                );
            })
            .catch((err) =>
                toast.error(getApiErrorMessage(err, 'Failed to load vehicles'))
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredVehicles = useMemo(() => {
        const query = search.trim();
        return vehicles.filter((vehicle) => {
            const matchesSearch =
                !query ||
                String(vehicle.vehicleNumber).includes(query);
            const onJourney = Boolean(vehicle.currentJourneyId);
            const matchesAvailability =
                availabilityFilter === 'all' ||
                (availabilityFilter === 'available' && !onJourney) ||
                (availabilityFilter === 'on_journey' && onJourney);
            return matchesSearch && matchesAvailability;
        });
    }, [vehicles, search, availabilityFilter]);

    const columns = useMemo(() => getVehicleListColumns(), []);

    return (
        <Box sx={pageShellSx}>
            <Card sx={{ ...pageCardSx, mt: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3,
                        alignItems: 'flex-start',
                    }}
                >
                    <TextField
                        placeholder="Search by vehicle number…"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 280, flex: 1 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="availability-filter-label">
                            Availability
                        </InputLabel>
                        <Select
                            labelId="availability-filter-label"
                            value={availabilityFilter}
                            label="Availability"
                            onChange={(e) =>
                                setAvailabilityFilter(
                                    e.target.value as AvailabilityFilter
                                )
                            }
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="available">Available</MenuItem>
                            <MenuItem value="on_journey">On Journey</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {!loading && filteredVehicles.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <LocalShipping
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No vehicles found
                        </Typography>
                        <Typography color="text.secondary">
                            {search || availabilityFilter !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'No vehicles found. Add a vehicle.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table
                        rows={filteredVehicles}
                        columns={columns}
                        loading={loading}
                    />
                )}
            </Card>
        </Box>
    );
};

export default VehicleList;

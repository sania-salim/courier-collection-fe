import {
    Box,
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { Search, ShoppingBag } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/Table/Table';
import { getSealedBagListColumns } from '@/constants/GetSealedBagListColumns';
import { Route } from '@/types/route';
import { Region } from '@/types/region';
import { BagStatus, SealedBagListRow } from '@/types/sealedBag';
import { Vehicle } from '@/types/vehicle';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { fetchRegions } from '@/utils/requests/region.api';
import { fetchRoutes } from '@/utils/requests/route.api';
import { fetchSealedBags } from '@/utils/requests/sealedBag.api';
import { fetchVehicles } from '@/utils/requests/vehicle.api';
import { pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { BAG_STATUSES, getBagStatusLabel } from '@/utils/statusUtils';

const SealedBagList = () => {
    const [bags, setBags] = useState<SealedBagListRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<BagStatus[]>([]);

    const loadData = useCallback(() => {
        setLoading(true);
        Promise.all([
            fetchSealedBags(),
            fetchRegions(),
            fetchRoutes(),
            fetchVehicles(),
        ])
            .then(([bagsRes, regionsRes, routesRes, vehiclesRes]) => {
                const regionById = new Map<string, Region>(
                    regionsRes.data.map((region) => [region.id, region])
                );
                const routeById = new Map<string, Route>(
                    routesRes.data.map((route) => [route.id, route])
                );
                const vehicleById = new Map<string, Vehicle>(
                    vehiclesRes.data.map((vehicle) => [vehicle.id, vehicle])
                );

                const regionLabel = (id: string) => {
                    const region = regionById.get(id);
                    return region
                        ? `${region.name} (${region.regionCode})`
                        : id.slice(0, 8);
                };

                setBags(
                    bagsRes.data.map((bag) => {
                        const route = bag.routeId
                            ? routeById.get(bag.routeId)
                            : undefined;
                        const vehicle = bag.vehicleId
                            ? vehicleById.get(bag.vehicleId)
                            : undefined;

                        return {
                            ...bag,
                            originRegionLabel: regionLabel(bag.originRegionId),
                            currentRegionLabel: regionLabel(bag.currentRegionId),
                            toRegionLabel: bag.toRegionId
                                ? regionLabel(bag.toRegionId)
                                : '—',
                            routeLabel: route ? route.name : '—',
                            vehicleLabel: vehicle
                                ? `#${vehicle.vehicleNumber}`
                                : '—',
                        };
                    })
                );
            })
            .catch((err) =>
                toast.error(
                    getApiErrorMessage(err, 'Failed to load sealed bags')
                )
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredBags = useMemo(() => {
        const query = search.trim().toLowerCase();
        return bags.filter((bag) => {
            const matchesStatus =
                statusFilter.length === 0 ||
                statusFilter.includes(bag.status);
            const matchesSearch =
                !query ||
                bag.id.toLowerCase().includes(query) ||
                bag.currentRegionLabel.toLowerCase().includes(query) ||
                bag.toRegionLabel.toLowerCase().includes(query) ||
                bag.routeLabel.toLowerCase().includes(query) ||
                bag.vehicleLabel.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [bags, search, statusFilter]);

    const columns = useMemo(() => getSealedBagListColumns(), []);

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
                        placeholder="Search by ID, region, or vehicle…"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 280 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <Search fontSize="small" color="action" />
                                ),
                            },
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel id="bag-status-filter-label">
                            Status
                        </InputLabel>
                        <Select
                            labelId="bag-status-filter-label"
                            multiple
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value as BagStatus[])
                            }
                            input={<OutlinedInput label="Status" />}
                            renderValue={(selected) =>
                                selected.length === 0
                                    ? 'All statuses'
                                    : `${selected.length} selected`
                            }
                        >
                            {BAG_STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {getBagStatusLabel(status)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {!loading && filteredBags.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <ShoppingBag
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No sealed bags found
                        </Typography>
                        <Typography color="text.secondary">
                            {search || statusFilter.length > 0
                                ? 'Try adjusting your filters.'
                                : 'Bags are created at hubs when consolidating packages for a lane.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table rows={filteredBags} columns={columns} loading={loading} />
                )}
            </Card>
        </Box>
    );
};

export default SealedBagList;

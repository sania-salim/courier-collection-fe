import {
    Box,
    Button,
    Card,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { Add, Route as RouteIcon, Search } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/Table/Table';
import { getRouteListColumns } from '@/constants/GetRouteListColumns';
import AddRouteDialog from '@/pages/Routes/AddRouteDialog';
import { RouteListRow } from '@/types/route';
import { pageActionsSx, pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { fetchRouteWithStops, fetchRoutes } from '@/utils/requests/route.api';

const RouteList = () => {
    const [routes, setRoutes] = useState<RouteListRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const loadData = useCallback(() => {
        setLoading(true);
        fetchRoutes()
            .then(async (routesRes) => {
                const enriched = await Promise.all(
                    routesRes.data.map(async (route) => {
                        try {
                            const stopsRes = await fetchRouteWithStops(route.id);
                            const stopRegions = stopsRes.data.stops.map(
                                (stop) => stop.region.regionCode
                            );
                            return {
                                ...route,
                                stopCount: stopsRes.data.stops.length,
                                stopSummary: stopRegions.join(' → ') || '—',
                            };
                        } catch {
                            return {
                                ...route,
                                stopCount: 0,
                                stopSummary: '—',
                            };
                        }
                    })
                );
                setRoutes(enriched);
            })
            .catch((err) =>
                toast.error(getApiErrorMessage(err, 'Failed to load routes'))
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredRoutes = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return routes;
        return routes.filter(
            (route) =>
                route.name.toLowerCase().includes(query) ||
                route.code.toLowerCase().includes(query) ||
                route.stopSummary.toLowerCase().includes(query)
        );
    }, [routes, search]);

    const columns = useMemo(() => getRouteListColumns(), []);

    return (
        <Box sx={pageShellSx}>
            <Box sx={pageActionsSx}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    Add route
                </Button>
            </Box>

            <Card sx={pageCardSx}>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        placeholder="Search by name, code, or stops…"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 280 }}
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
                </Box>

                {!loading && filteredRoutes.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <RouteIcon
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No routes found
                        </Typography>
                        <Typography color="text.secondary">
                            {search
                                ? 'Try adjusting your search.'
                                : 'Create a route with ordered region stops to use on journeys.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table rows={filteredRoutes} columns={columns} loading={loading} />
                )}
            </Card>

            <AddRouteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={loadData}
            />
        </Box>
    );
};

export default RouteList;

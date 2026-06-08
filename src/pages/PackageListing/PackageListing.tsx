import {
    Box,
    Card,
    Chip,
    Container,
    Grid2,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import {
    CheckCircle,
    Inventory2,
    LocalShipping,
    Warning,
} from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import StatsCard from '@/components/StatsCard/StatsCard';
import Table from '@/components/Table/Table';
import { getPackageListColumns } from '@/constants/GetPackageListColumns';
import { Package, PackageStatus } from '@/types/package';
import { fetchPackages } from '@/utils/requests/package.api';

const STATUS_FILTERS: { label: string; value: PackageStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'To Be Picked Up', value: 'to_be_picked_up' },
    { label: 'In Transit', value: 'in_transit' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Delayed', value: 'delayed' },
];

const PackageListing = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<PackageStatus | 'all'>(
        'all'
    );

    const loadPackages = useCallback(() => {
        setLoading(true);
        fetchPackages()
            .then((res) => setPackages(res.data))
            .catch(() => toast.error('Failed to load packages'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadPackages();
    }, [loadPackages]);

    const stats = useMemo(() => {
        const total = packages.length;
        const inTransit = packages.filter(
            (p) => p.current_status === 'in_transit'
        ).length;
        const delivered = packages.filter(
            (p) => p.current_status === 'delivered'
        ).length;
        const delayed = packages.filter(
            (p) => p.current_status === 'delayed'
        ).length;
        return { total, inTransit, delivered, delayed };
    }, [packages]);

    const filteredPackages = useMemo(() => {
        const query = search.trim().toLowerCase();
        return packages.filter((pkg) => {
            const matchesStatus =
                statusFilter === 'all' || pkg.current_status === statusFilter;
            const matchesSearch =
                !query ||
                pkg.to_name.toLowerCase().includes(query) ||
                pkg.to_address.toLowerCase().includes(query) ||
                pkg.tracking_id.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [packages, search, statusFilter]);

    const columns = useMemo(() => getPackageListColumns(), []);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Package Listing
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor shipments across the network. Region maps and live
                    tracking views will be added in future phases.
                </Typography>
            </Box>

            <Grid2 container spacing={2} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        title="Total Packages"
                        value={stats.total}
                        icon={<Inventory2 />}
                        accent="#0d9488"
                        loading={loading}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        title="In Transit"
                        value={stats.inTransit}
                        icon={<LocalShipping />}
                        accent="#6366f1"
                        loading={loading}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        title="Delivered"
                        value={stats.delivered}
                        icon={<CheckCircle />}
                        accent="#22c55e"
                        loading={loading}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard
                        title="Delayed"
                        value={stats.delayed}
                        icon={<Warning />}
                        accent="#ef4444"
                        loading={loading}
                    />
                </Grid2>
            </Grid2>

            <Card sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        placeholder="Search by recipient, address, or tracking ID…"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 280, flex: 1 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Inventory2
                                            fontSize="small"
                                            color="action"
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {STATUS_FILTERS.map((filter) => (
                            <Chip
                                key={filter.value}
                                label={filter.label}
                                clickable
                                color={
                                    statusFilter === filter.value
                                        ? 'primary'
                                        : 'default'
                                }
                                variant={
                                    statusFilter === filter.value
                                        ? 'filled'
                                        : 'outlined'
                                }
                                onClick={() => setStatusFilter(filter.value)}
                            />
                        ))}
                    </Box>
                </Box>

                <Table
                    rows={filteredPackages}
                    columns={columns}
                    loading={loading}
                />
            </Card>
        </Container>
    );
};

export default PackageListing;

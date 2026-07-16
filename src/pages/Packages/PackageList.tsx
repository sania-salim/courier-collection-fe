import {
    Box,
    Button,
    Card,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { Add, Inventory2, Search } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/Table/Table';
import { SIMULATION_TICK_EVENT } from '@/components/SimulateJourneyButton/SimulateJourneyButton';
import { getPackageListColumns } from '@/constants/GetPackageListColumns';
import AddPackageDialog from '@/pages/Packages/AddPackageDialog';
import { ExternalBusiness } from '@/types/business';
import { PackageListRow, PackageStatus } from '@/types/package';
import { Region } from '@/types/region';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { fetchExternalBusinesses } from '@/utils/requests/business.api';
import { fetchPackages } from '@/utils/requests/package.api';
import { fetchRegions } from '@/utils/requests/region.api';
import { pageActionsSx, pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { PACKAGE_STATUSES, getStatusLabel } from '@/utils/statusUtils';

const PackageList = () => {
    const [packages, setPackages] = useState<PackageListRow[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [businesses, setBusinesses] = useState<ExternalBusiness[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<PackageStatus[]>([]);
    const [packageDialogOpen, setPackageDialogOpen] = useState(false);

    const loadData = useCallback(() => {
        setLoading(true);
        Promise.all([
            fetchPackages(),
            fetchRegions(),
            fetchExternalBusinesses(),
        ])
            .then(([packagesRes, regionsRes, businessesRes]) => {
                const regionMap = Object.fromEntries(
                    regionsRes.data.map((r) => [r.id, r.name])
                );
                setRegions(regionsRes.data);
                setBusinesses(businessesRes.data);
                setPackages(
                    packagesRes.data.map((pkg) => ({
                        ...pkg,
                        fromRegionName: regionMap[pkg.fromRegionId] ?? '—',
                        currentRegionName:
                            regionMap[pkg.currentRegionId] ?? '—',
                        sealedBagLabel: pkg.sealedBagId
                            ? `${pkg.sealedBagId.slice(0, 8)}…`
                            : undefined,
                    }))
                );
            })
            .catch((err) =>
                toast.error(getApiErrorMessage(err, 'Failed to load packages'))
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        const onTick = () => loadData();
        window.addEventListener(SIMULATION_TICK_EVENT, onTick);
        return () => window.removeEventListener(SIMULATION_TICK_EVENT, onTick);
    }, [loadData]);

    const handleBusinessCreated = (business: ExternalBusiness) => {
        setBusinesses((prev) =>
            [...prev, business].sort((a, b) => a.name.localeCompare(b.name))
        );
    };

    const filteredPackages = useMemo(() => {
        const query = search.trim().toLowerCase();
        return packages.filter((pkg) => {
            const matchesStatus =
                statusFilter.length === 0 ||
                statusFilter.includes(pkg.status);
            const matchesSearch =
                !query ||
                pkg.code.toLowerCase().includes(query) ||
                pkg.toAddress.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });
    }, [packages, search, statusFilter]);

    const columns = useMemo(() => getPackageListColumns(), []);

    return (
        <Box sx={pageShellSx}>
            <Box sx={pageActionsSx}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setPackageDialogOpen(true)}
                >
                    Add package
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
                    <TextField
                        placeholder="Search by package code or address…"
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
                    <FormControl size="small" sx={{ minWidth: 280 }}>
                        <InputLabel id="status-filter-label">Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            multiple
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as PackageStatus[]
                                )
                            }
                            input={<OutlinedInput label="Status" />}
                            renderValue={(selected) =>
                                selected.length === 0
                                    ? 'All statuses'
                                    : `${selected.length} selected`
                            }
                        >
                            {PACKAGE_STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {getStatusLabel(status)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {!loading && filteredPackages.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Inventory2
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No packages found
                        </Typography>
                        <Typography color="text.secondary">
                            {search || statusFilter.length > 0
                                ? 'Try adjusting your search or filters.'
                                : 'Packages will appear here once they are created in the system.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table
                        rows={filteredPackages}
                        columns={columns}
                        loading={loading}
                    />
                )}
            </Card>

            <AddPackageDialog
                open={packageDialogOpen}
                onClose={() => setPackageDialogOpen(false)}
                onCreated={loadData}
                regions={regions}
                businesses={businesses}
                onBusinessCreated={handleBusinessCreated}
            />
        </Box>
    );
};

export default PackageList;

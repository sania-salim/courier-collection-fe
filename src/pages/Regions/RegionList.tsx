import {
    Box,
    Card,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { Place, Search } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '@/components/Table/Table';
import { getRegionListColumns } from '@/constants/GetRegionListColumns';
import { Region } from '@/types/region';
import { pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { fetchRegions } from '@/utils/requests/region.api';

const RegionList = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadData = useCallback(() => {
        setLoading(true);
        fetchRegions()
            .then((res) => setRegions(res.data))
            .catch((err) =>
                toast.error(getApiErrorMessage(err, 'Failed to load regions'))
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredRegions = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return regions;
        return regions.filter(
            (region) =>
                region.name.toLowerCase().includes(query) ||
                region.regionCode.toLowerCase().includes(query)
        );
    }, [regions, search]);

    const columns = useMemo(() => getRegionListColumns(), []);

    return (
        <Box sx={pageShellSx}>
            <Card sx={{ ...pageCardSx, mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        placeholder="Search by name or code…"
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

                {!loading && filteredRegions.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Place
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No regions found
                        </Typography>
                        <Typography color="text.secondary">
                            {search
                                ? 'Try adjusting your search.'
                                : 'Regions are seeded at setup and will appear here.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table
                        rows={filteredRegions}
                        columns={columns}
                        loading={loading}
                        pagination={false}
                    />
                )}
            </Card>
        </Box>
    );
};

export default RegionList;

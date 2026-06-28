import {
    Box,
    Button,
    Card,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { Add, Business, Search } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AddEnterpriseDialog from '@/components/AddEnterpriseDialog/AddEnterpriseDialog';
import Table from '@/components/Table/Table';
import { getBusinessListColumns } from '@/constants/GetBusinessListColumns';
import { ExternalBusiness } from '@/types/business';
import { pageActionsSx, pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { fetchExternalBusinesses } from '@/utils/requests/business.api';

const BusinessList = () => {
    const [businesses, setBusinesses] = useState<ExternalBusiness[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const loadData = useCallback(() => {
        setLoading(true);
        fetchExternalBusinesses()
            .then((res) => setBusinesses(res.data))
            .catch((err) =>
                toast.error(
                    getApiErrorMessage(err, 'Failed to load external businesses')
                )
            )
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredBusinesses = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return businesses;
        return businesses.filter(
            (business) =>
                business.name.toLowerCase().includes(query) ||
                business.code.toLowerCase().includes(query)
        );
    }, [businesses, search]);

    const columns = useMemo(() => getBusinessListColumns(), []);

    const handleCreated = (business: ExternalBusiness) => {
        setBusinesses((prev) =>
            [...prev, business].sort((a, b) => a.name.localeCompare(b.name))
        );
    };

    return (
        <Box sx={pageShellSx}>
            <Box sx={pageActionsSx}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    Add external business
                </Button>
            </Box>

            <Card sx={pageCardSx}>
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

                {!loading && filteredBusinesses.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Business
                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                            No external businesses found
                        </Typography>
                        <Typography color="text.secondary">
                            {search
                                ? 'Try adjusting your search.'
                                : 'Add a sender business to use when creating packages.'}
                        </Typography>
                    </Box>
                ) : (
                    <Table
                        rows={filteredBusinesses}
                        columns={columns}
                        loading={loading}
                    />
                )}
            </Card>

            <AddEnterpriseDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onCreated={handleCreated}
            />
        </Box>
    );
};

export default BusinessList;

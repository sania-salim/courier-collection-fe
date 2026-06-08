import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import {
    LocationOn,
    Person,
    QrCodeScanner,
    Search,
} from '@mui/icons-material';
import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusChip from '@/components/StatusChip/StatusChip';
import TrackingTimeline from '@/components/TrackingTimeline/TrackingTimeline';
import { getRegionName } from '@/constants/regions';
import { TrackingDetails } from '@/types/package';
import { fetchTrackingDetails } from '@/utils/requests/package.api';

const Tracking = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [trackingId, setTrackingId] = useState(
        searchParams.get('id') ?? ''
    );
    const [details, setDetails] = useState<TrackingDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const lookup = async (id: string) => {
        const trimmed = id.trim();
        if (!trimmed) {
            toast.warning('Enter a tracking ID');
            return;
        }

        setLoading(true);
        setSearched(true);
        setSearchParams({ id: trimmed });

        try {
            const res = await fetchTrackingDetails(trimmed);
            setDetails(res.data);
        } catch {
            setDetails(null);
            toast.error('Tracking ID not found');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setTrackingId(id);
            lookup(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        lookup(trackingId);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Track Your Package
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Enter a tracking ID to view live status and delivery
                    details. Interactive region maps coming in a future phase.
                </Typography>
            </Box>

            <Card
                component="form"
                onSubmit={handleSubmit}
                sx={{ mb: 4, p: 3 }}
            >
                <TextField
                    fullWidth
                    label="Tracking ID"
                    placeholder="e.g. d0000001-0000-4000-8000-000000000002"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <QrCodeScanner color="primary" />
                                </InputAdornment>
                            ),
                            sx: { fontFamily: 'monospace' },
                        },
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={<Search />}
                    sx={{ mt: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
                >
                    {loading ? 'Searching…' : 'Track Package'}
                </Button>
            </Card>

            {searched && !loading && details && (
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: 2,
                                mb: 3,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                >
                                    Tracking ID
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ fontFamily: 'monospace' }}
                                >
                                    {details.tracking_id}
                                </Typography>
                            </Box>
                            <StatusChip
                                status={details.current_status}
                                size="medium"
                            />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: '1fr 1fr',
                                },
                                gap: 3,
                                mb: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Person color="primary" />
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Recipient
                                    </Typography>
                                    <Typography fontWeight={600}>
                                        {details.to_name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <LocationOn color="primary" />
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Delivery Address
                                    </Typography>
                                    <Typography fontWeight={600}>
                                        {details.to_address}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                bgcolor: 'action.hover',
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexWrap: 'wrap',
                            }}
                        >
                            <LocationOn />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Current Region
                                </Typography>
                                <Typography fontWeight={600}>
                                    {getRegionName(details.current_region)}
                                </Typography>
                            </Box>
                            <Chip
                                label="Map view — coming soon"
                                size="small"
                                variant="outlined"
                                color="secondary"
                            />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Shipment Progress
                        </Typography>
                        <TrackingTimeline
                            currentStatus={details.current_status}
                        />
                    </CardContent>
                </Card>
            )}

            {searched && !loading && !details && (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        No package found for that tracking ID. Check the ID and
                        try again.
                    </Typography>
                </Card>
            )}
        </Container>
    );
};

export default Tracking;

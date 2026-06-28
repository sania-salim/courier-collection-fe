import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid2,
    Link,
    Typography,
} from '@mui/material';
import { ArrowBack, Warning } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PackageTrackingMap from '@/components/PackageTrackingMap/PackageTrackingMap';
import PackageTimeline from '@/components/PackageTimeline/PackageTimeline';
import StatusChip from '@/components/StatusChip/StatusChip';
import paths from '@/router/routes';
import { pageCardSx, pageShellSx } from '@/styles/pageLayout';
import { ExternalBusiness } from '@/types/business';
import { CourierPackage, PackageScanLog } from '@/types/package';
import { Region } from '@/types/region';
import { formatDateTime } from '@/utils/dateUtils';
import { getApiErrorMessage } from '@/utils/errorUtils';
import { fetchExternalBusinesses } from '@/utils/requests/business.api';
import { fetchPackage, fetchPackageScanLogs } from '@/utils/requests/package.api';
import { fetchRegions } from '@/utils/requests/region.api';

type DetailFieldProps = {
    label: string;
    value: React.ReactNode;
};

const DetailField = ({ label, value }: DetailFieldProps) => (
    <Box>
        <Typography variant="caption" color="text.secondary" display="block">
            {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
    </Box>
);

const PackageDetail = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState<CourierPackage | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [businesses, setBusinesses] = useState<ExternalBusiness[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [scanLogs, setScanLogs] = useState<PackageScanLog[]>([]);

    const loadData = useCallback(() => {
        if (!code) return;
        setLoading(true);
        setNotFound(false);

        Promise.all([
            fetchPackage(code),
            fetchRegions(),
            fetchExternalBusinesses(),
            fetchPackageScanLogs(code),
        ])
            .then(([pkgRes, regionsRes, businessesRes, scanLogsRes]) => {
                setPkg(pkgRes.data);
                setRegions(regionsRes.data);
                setBusinesses(businessesRes.data);
                setScanLogs(scanLogsRes.data);
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    setNotFound(true);
                } else {
                    toast.error(
                        getApiErrorMessage(err, 'Failed to load package')
                    );
                }
            })
            .finally(() => setLoading(false));
    }, [code]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const regionsById = useMemo(
        () => Object.fromEntries(regions.map((r) => [r.id, r])),
        [regions]
    );

    const business = useMemo(
        () => businesses.find((b) => b.id === pkg?.fromAddressId),
        [businesses, pkg?.fromAddressId]
    );

    const fromRegion = pkg ? regionsById[pkg.fromRegionId] : undefined;
    const toRegion = pkg ? regionsById[pkg.toRegionId] : undefined;
    const currentRegion = pkg ? regionsById[pkg.currentRegionId] : undefined;

    if (loading) {
        return (
            <Box
                className="flex min-h-[50vh] items-center justify-center"
                sx={{ py: 8 }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (notFound || !pkg) {
        return (
            <Box sx={pageShellSx}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    Package not found. It may have been removed or the code is
                    incorrect.
                </Alert>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(paths.PACKAGES_PATH)}
                >
                    Back to packages
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={pageShellSx}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(paths.PACKAGES_PATH)}
                sx={{ mb: 2, mt: 1 }}
            >
                Back to packages
            </Button>

            {pkg.status === 'DELAYED' && (
                <Alert
                    severity="warning"
                    icon={<Warning />}
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    <Typography variant="subtitle2" fontWeight={700}>
                        This package is delayed
                    </Typography>
                    <Typography variant="body2">
                        Delivery timelines may be affected. Check journey status
                        for more details.
                    </Typography>
                </Alert>
            )}

            <Grid2 container spacing={3} sx={{ mt: 1 }}>
                <Grid2 size={{ xs: 12, lg: 7 }}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent sx={pageCardSx}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: 240 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Code
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            mb: 2,
                                        }}
                                    >
                                        {pkg.code}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        To
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {pkg.toAddress}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Seller
                                    </Typography>
                                    <Typography variant="body1">
                                        {business
                                            ? `${business.name} — ${business.address}`
                                            : pkg.fromAddressId}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: 1.5,
                                    }}
                                >
                                    <StatusChip
                                        status={pkg.status}
                                        size="medium"
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Scan log
                            </Typography>
                            <PackageTimeline scanLogs={scanLogs} />
                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent sx={pageCardSx}>
                            <Typography variant="h6" gutterBottom>
                                Package details
                            </Typography>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="From region"
                                        value={
                                            fromRegion?.name ??
                                            pkg.fromRegionId
                                        }
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="To region"
                                        value={
                                            toRegion?.name ?? pkg.toRegionId
                                        }
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="Current location"
                                        value={
                                            currentRegion?.name ??
                                            pkg.currentRegionId
                                        }
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="Weight"
                                        value={`${pkg.weight} kg`}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="Created at"
                                        value={formatDateTime(pkg.createdAt)}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="Picked up at"
                                        value={formatDateTime(pkg.pickedUpAt)}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <DetailField
                                        label="Sealed bag"
                                        value={
                                            pkg.sealedBagId ? (
                                                <Link
                                                    component={RouterLink}
                                                    to={paths.bagDetail(
                                                        pkg.sealedBagId
                                                    )}
                                                    underline="hover"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                    }}
                                                >
                                                    {pkg.sealedBagId.slice(
                                                        0,
                                                        8
                                                    )}
                                                    …
                                                </Link>
                                            ) : (
                                                'Not assigned'
                                            )
                                        }
                                    />
                                </Grid2>
                            </Grid2>
                        </CardContent>
                    </Card>
                </Grid2>

                <Grid2 size={{ xs: 12, lg: 5 }}>
                    {fromRegion && toRegion ? (
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                minHeight: 360,
                                overflow: 'hidden',
                            }}
                        >
                            <PackageTrackingMap
                                fromRegion={fromRegion}
                                toRegion={toRegion}
                                currentRegion={currentRegion}
                                currentRegionId={pkg.currentRegionId}
                            />
                        </Card>
                    ) : (
                        <Card
                            variant="outlined"
                            sx={{
                                minHeight: 360,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 3,
                            }}
                        >
                            <Typography color="text.secondary" align="center">
                                Map unavailable — region coordinates missing.
                            </Typography>
                        </Card>
                    )}
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default PackageDetail;

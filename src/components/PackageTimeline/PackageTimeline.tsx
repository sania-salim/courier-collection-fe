import { Box, Stack, Typography } from '@mui/material';
import { PackageScanLog } from '@/types/package';
import { formatDateTime } from '@/utils/dateUtils';
import { getStatusLabel } from '@/utils/statusUtils';

type PackageTimelineProps = {
    scanLogs: PackageScanLog[];
};

const PackageTimeline = ({ scanLogs }: PackageTimelineProps) => {
    if (scanLogs.length === 0) {
        return (
            <Typography color="text.secondary" variant="body2">
                No scan events recorded yet.
            </Typography>
        );
    }

    return (
        <Stack spacing={0}>
            {scanLogs.map((entry, index) => (
                <Box key={entry.id} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 16,
                            pt: 0.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor:
                                    index === scanLogs.length - 1
                                        ? 'primary.main'
                                        : 'transparent',
                                border: 2,
                                borderColor:
                                    index === scanLogs.length - 1
                                        ? 'primary.main'
                                        : 'grey.400',
                            }}
                        />
                        {index < scanLogs.length - 1 && (
                            <Box
                                sx={{
                                    width: 2,
                                    flex: 1,
                                    minHeight: 32,
                                    bgcolor: 'divider',
                                    my: 0.5,
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ pb: 3, flex: 1 }}>
                        <Typography variant="subtitle2">
                            {getStatusLabel(entry.status)}
                            {index === scanLogs.length - 1 && ' (current)'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {entry.region.name} ({entry.region.regionCode})
                        </Typography>
                        {entry.notes ? (
                            <Typography variant="body2" color="text.secondary">
                                {entry.notes}
                            </Typography>
                        ) : null}
                        <Typography variant="caption" color="text.secondary">
                            {formatDateTime(entry.scannedAt)}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
};

export default PackageTimeline;

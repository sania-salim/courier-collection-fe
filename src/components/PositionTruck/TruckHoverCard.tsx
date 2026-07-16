import { Box, Divider, Stack, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RouteIcon from '@mui/icons-material/Route';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import TagIcon from '@mui/icons-material/Tag';

type TruckHoverCardProps = {
    vehicleNumber: number;
    journeyId: string;
    routeCode: string;
    fromLabel: string;
    toLabel: string;
};

const labelSx = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: 'text.secondary',
    lineHeight: 1.2,
};

const valueSx = {
    fontSize: 13,
    fontWeight: 600,
    color: 'text.primary',
    lineHeight: 1.3,
};

const TruckHoverCard = ({
    vehicleNumber,
    journeyId,
    routeCode,
    fromLabel,
    toLabel,
}: TruckHoverCardProps) => (
    <Box
        sx={{
            minWidth: 200,
            maxWidth: 260,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
            border: '1px solid',
            borderColor: 'divider',
        }}
    >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(192, 38, 211, 0.12)',
                    color: '#c026d3',
                    flexShrink: 0,
                }}
            >
                <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={labelSx}>Vehicle</Typography>
                <Typography sx={{ ...valueSx, fontSize: 15 }}>
                    #{vehicleNumber}
                </Typography>
            </Box>
        </Stack>

        <Divider sx={{ mb: 1.25 }} />

        <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
                <TagIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
                <Box>
                    <Typography sx={labelSx}>Journey</Typography>
                    <Typography
                        sx={{
                            ...valueSx,
                            fontFamily: 'ui-monospace, monospace',
                            fontWeight: 500,
                            fontSize: 12,
                        }}
                    >
                        {journeyId.slice(0, 8)}…
                    </Typography>
                </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start">
                <RouteIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
                <Box>
                    <Typography sx={labelSx}>Route</Typography>
                    <Typography sx={valueSx}>{routeCode || '—'}</Typography>
                </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start">
                <PlaceOutlinedIcon
                    sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }}
                />
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={labelSx}>Path</Typography>
                    <Typography sx={{ ...valueSx, fontWeight: 500 }}>
                        {fromLabel}
                        <Box
                            component="span"
                            sx={{
                                mx: 0.75,
                                color: '#c026d3',
                                fontWeight: 700,
                            }}
                        >
                            →
                        </Box>
                        {toLabel}
                    </Typography>
                </Box>
            </Stack>
        </Stack>
    </Box>
);

export default TruckHoverCard;

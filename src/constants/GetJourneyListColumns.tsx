import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BooleanChip from '@/components/BooleanChip/BooleanChip';
import JourneyStatusChip from '@/components/JourneyStatusChip/JourneyStatusChip';
import paths from '@/router/routes';
import { JourneyListRow, JourneyStatus } from '@/types/journey';
import { formatDateTime } from '@/utils/dateUtils';

export const getJourneyListColumns = (): GridColDef<JourneyListRow>[] => [
    {
        field: 'id',
        headerName: 'Journey ID',
        flex: 1.1,
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<JourneyListRow>) => (
            <Link
                component={RouterLink}
                to={paths.journeyDetail(params.row.id)}
                underline="hover"
                sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            >
                {params.row.id.slice(0, 8)}…
            </Link>
        ),
    },
    {
        field: 'vehicleNumber',
        headerName: 'Vehicle Number',
        flex: 0.8,
        minWidth: 120,
        valueGetter: (_value, row) => row.vehicle?.vehicleNumber ?? '—',
        renderCell: (params: GridRenderCellParams<JourneyListRow>) => {
            if (!params.row.vehicle) {
                return (
                    <Typography variant="body2" color="text.secondary">
                        —
                    </Typography>
                );
            }
            return (
                <Link
                    component={RouterLink}
                    to={paths.vehicleDetail(params.row.vehicle.id)}
                    underline="hover"
                    sx={{ fontFamily: 'monospace' }}
                >
                    {params.row.vehicle.vehicleNumber}
                </Link>
            );
        },
    },
    {
        field: 'routeName',
        headerName: 'Route Name',
        flex: 1,
        minWidth: 140,
        valueGetter: (_value, row) => row.route?.name ?? '—',
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 0.9,
        minWidth: 130,
        renderCell: (params: GridRenderCellParams<JourneyListRow>) => (
            <JourneyStatusChip status={params.value as JourneyStatus} />
        ),
    },
    {
        field: 'scheduledDepartureAt',
        headerName: 'Scheduled Departure',
        flex: 1,
        minWidth: 170,
        valueFormatter: (value) => formatDateTime(value as string | null),
    },
    {
        field: 'actualDepartureAt',
        headerName: 'Actual Departure',
        flex: 1,
        minWidth: 170,
        valueFormatter: (value) => formatDateTime(value as string | null),
    },
    {
        field: 'isDelayed',
        headerName: 'Delayed',
        flex: 0.6,
        minWidth: 90,
        renderCell: (params: GridRenderCellParams<JourneyListRow>) => (
            <BooleanChip value={Boolean(params.value)} />
        ),
    },
];

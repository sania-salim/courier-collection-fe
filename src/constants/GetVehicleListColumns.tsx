import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import JourneyStatusChip from '@/components/JourneyStatusChip/JourneyStatusChip';
import paths from '@/router/routes';
import { JourneyStatus } from '@/types/journey';
import { VehicleListRow } from '@/types/vehicle';

export const getVehicleListColumns = (): GridColDef<VehicleListRow>[] => [
    {
        field: 'vehicleNumber',
        headerName: 'Vehicle Number',
        flex: 0.9,
        minWidth: 130,
        renderCell: (params: GridRenderCellParams<VehicleListRow>) => (
            <Link
                component={RouterLink}
                to={paths.vehicleDetail(params.row.id)}
                underline="hover"
                sx={{ fontFamily: 'monospace' }}
            >
                {params.value}
            </Link>
        ),
    },
    {
        field: 'capacity',
        headerName: 'Capacity (kg)',
        flex: 0.8,
        minWidth: 120,
        valueFormatter: (value) => `${value} kg`,
    },
    {
        field: 'currentJourneyId',
        headerName: 'Current Journey',
        flex: 1.2,
        minWidth: 180,
        sortable: false,
        valueGetter: (_value, row) =>
            row.currentRouteName ?? row.currentJourneyId ?? '—',
        renderCell: (params: GridRenderCellParams<VehicleListRow>) => {
            if (!params.row.currentJourneyId) {
                return (
                    <Typography variant="body2" color="text.secondary">
                        —
                    </Typography>
                );
            }
            return (
                <Link
                    component={RouterLink}
                    to={paths.journeyDetail(params.row.currentJourneyId)}
                    underline="hover"
                    variant="body2"
                >
                    {params.row.currentRouteName ??
                        `${params.row.currentJourneyId.slice(0, 8)}…`}
                </Link>
            );
        },
    },
    {
        field: 'currentJourneyStatus',
        headerName: 'Journey Status',
        flex: 1,
        minWidth: 140,
        sortable: false,
        renderCell: (params: GridRenderCellParams<VehicleListRow>) => {
            if (!params.row.currentJourneyStatus) {
                return (
                    <Typography variant="body2" color="text.secondary">
                        —
                    </Typography>
                );
            }
            return (
                <JourneyStatusChip
                    status={params.row.currentJourneyStatus as JourneyStatus}
                />
            );
        },
    },
];

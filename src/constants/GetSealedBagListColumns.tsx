import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BagStatusChip from '@/components/BagStatusChip/BagStatusChip';
import paths from '@/router/routes';
import { SealedBagListRow } from '@/types/sealedBag';
import { formatDateTime } from '@/utils/dateUtils';

export const getSealedBagListColumns = (): GridColDef<SealedBagListRow>[] => [
    {
        field: 'id',
        headerName: 'Bag ID',
        flex: 1,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<SealedBagListRow>) => (
            <Link
                component={RouterLink}
                to={paths.bagDetail(params.row.id)}
                underline="hover"
            >
                {params.row.id.slice(0, 8)}…
            </Link>
        ),
    },
    {
        field: 'currentRegionLabel',
        headerName: 'Current Region',
        flex: 1,
        minWidth: 140,
    },
    {
        field: 'toRegionLabel',
        headerName: 'Final Destination',
        flex: 1,
        minWidth: 140,
    },
    {
        field: 'routeLabel',
        headerName: 'Route',
        flex: 0.8,
        minWidth: 120,
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 0.9,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<SealedBagListRow>) => (
            <BagStatusChip status={params.row.status} />
        ),
    },
    {
        field: 'itemCount',
        headerName: 'Items',
        flex: 0.5,
        minWidth: 80,
        type: 'number',
    },
    {
        field: 'weight',
        headerName: 'Weight (kg)',
        flex: 0.6,
        minWidth: 100,
        type: 'number',
        valueFormatter: (_value, row) =>
            `${row.weight} / ${row.maxWeightKg}`,
    },
    {
        field: 'vehicleLabel',
        headerName: 'Vehicle',
        flex: 0.7,
        minWidth: 100,
    },
    {
        field: 'sealedAt',
        headerName: 'Sealed At',
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) => formatDateTime(value as string | null),
    },
];

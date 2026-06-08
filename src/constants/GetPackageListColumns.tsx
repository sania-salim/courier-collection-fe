import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusChip from '@/components/StatusChip/StatusChip';
import { getRegionName } from '@/constants/regions';
import { Package, PackageStatus } from '@/types/package';
import paths from '@/router/routes';

const formatWeight = (weight: number | string) =>
    `${Number(weight).toFixed(2)} kg`;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

export const getPackageListColumns = (): GridColDef<Package>[] => [
    {
        field: 'tracking_id',
        headerName: 'Tracking ID',
        flex: 1.2,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<Package>) => (
            <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            >
                {params.value.slice(0, 8)}…
            </Typography>
        ),
    },
    {
        field: 'to_name',
        headerName: 'Recipient',
        flex: 1,
        minWidth: 140,
    },
    {
        field: 'to_address',
        headerName: 'Address',
        flex: 1.4,
        minWidth: 180,
    },
    {
        field: 'current_region_id',
        headerName: 'Current Region',
        flex: 0.9,
        minWidth: 130,
        valueGetter: (_value, row) => getRegionName(row.current_region_id),
    },
    {
        field: 'weight',
        headerName: 'Weight',
        flex: 0.6,
        minWidth: 90,
        valueFormatter: (value) => formatWeight(value as number | string),
    },
    {
        field: 'current_status',
        headerName: 'Status',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<Package>) => (
            <StatusChip status={params.value as PackageStatus} />
        ),
    },
    {
        field: 'created_at',
        headerName: 'Created',
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (value) => formatDate(value as string),
    },
    {
        field: 'actions',
        headerName: '',
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<Package>) => (
            <Button
                component={Link}
                to={`${paths.TRACKING_PATH}?id=${params.row.tracking_id}`}
                size="small"
                variant="outlined"
                sx={{ textTransform: 'none', borderRadius: 2 }}
            >
                Track
            </Button>
        ),
    },
];

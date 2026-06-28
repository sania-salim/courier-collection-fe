import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StatusChip from '@/components/StatusChip/StatusChip';
import paths from '@/router/routes';
import { PackageListRow, PackageStatus } from '@/types/package';
import { formatDateTime } from '@/utils/dateUtils';

export const getPackageListColumns = (): GridColDef<PackageListRow>[] => [
    {
        field: 'code',
        headerName: 'Package Code',
        flex: 1.1,
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<PackageListRow>) => (
            <Link
                component={RouterLink}
                to={paths.packageDetail(params.row.code)}
                underline="hover"
                sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            >
                {params.value}
            </Link>
        ),
    },
    {
        field: 'fromRegionName',
        headerName: 'From Region',
        flex: 1,
        minWidth: 120,
        valueGetter: (_value, row) => row.fromRegionName ?? '—',
    },
    {
        field: 'currentRegionName',
        headerName: 'Current Location',
        flex: 1,
        minWidth: 130,
        valueGetter: (_value, row) => row.currentRegionName ?? '—',
    },
    {
        field: 'toAddress',
        headerName: 'To Address',
        flex: 1.4,
        minWidth: 180,
    },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1.1,
        minWidth: 170,
        renderCell: (params: GridRenderCellParams<PackageListRow>) => (
            <StatusChip status={params.value as PackageStatus} />
        ),
    },
    {
        field: 'sealedBagLabel',
        headerName: 'Sealed Bag',
        flex: 0.9,
        minWidth: 120,
        sortable: false,
        valueGetter: (_value, row) => row.sealedBagLabel ?? '—',
        renderCell: (params: GridRenderCellParams<PackageListRow>) => {
            if (!params.row.sealedBagId) {
                return (
                    <Typography variant="body2" color="text.secondary">
                        —
                    </Typography>
                );
            }
            return (
                <Link
                    component={RouterLink}
                    to={paths.bagDetail(params.row.sealedBagId)}
                    underline="hover"
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                >
                    {params.row.sealedBagId.slice(0, 8)}…
                </Link>
            );
        },
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        flex: 1,
        minWidth: 170,
        valueFormatter: (value) => formatDateTime(value as string),
    },
];

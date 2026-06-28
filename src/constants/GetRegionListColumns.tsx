import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import paths from '@/router/routes';
import { Region } from '@/types/region';

export const getRegionListColumns = (): GridColDef<Region>[] => [
    {
        field: 'name',
        headerName: 'Region Name',
        flex: 1.2,
        minWidth: 160,
        renderCell: (params: GridRenderCellParams<Region>) => (
            <Link
                component={RouterLink}
                to={paths.regionDetail(params.row.id)}
                underline="hover"
            >
                {params.value}
            </Link>
        ),
    },
    {
        field: 'regionCode',
        headerName: 'Region Code',
        flex: 0.8,
        minWidth: 120,
    },
    {
        field: 'locationLatitude',
        headerName: 'Latitude',
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (value) => Number(value).toFixed(4),
    },
    {
        field: 'locationLongitude',
        headerName: 'Longitude',
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (value) => Number(value).toFixed(4),
    },
];

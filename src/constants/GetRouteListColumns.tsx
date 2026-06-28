import { GridColDef } from '@mui/x-data-grid';
import { RouteListRow } from '@/types/route';

export const getRouteListColumns = (): GridColDef<RouteListRow>[] => [
    {
        field: 'name',
        headerName: 'Route Name',
        flex: 1.2,
        minWidth: 160,
    },
    {
        field: 'code',
        headerName: 'Route Code',
        flex: 0.8,
        minWidth: 120,
    },
    {
        field: 'stopCount',
        headerName: 'Stops',
        flex: 0.5,
        minWidth: 80,
        type: 'number',
    },
    {
        field: 'stopSummary',
        headerName: 'Region Stops',
        flex: 1.5,
        minWidth: 220,
    },
];

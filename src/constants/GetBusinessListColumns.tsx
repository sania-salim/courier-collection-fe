import { GridColDef } from '@mui/x-data-grid';
import { ExternalBusiness } from '@/types/business';

export const getBusinessListColumns = (): GridColDef<ExternalBusiness>[] => [
    {
        field: 'name',
        headerName: 'Name',
        flex: 1.2,
        minWidth: 160,
    },
    {
        field: 'code',
        headerName: 'Code',
        flex: 0.8,
        minWidth: 120,
    },
    {
        field: 'address',
        headerName: 'Address',
        flex: 1.6,
        minWidth: 200,
    },
];

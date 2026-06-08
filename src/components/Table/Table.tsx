import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';

type TableProps<T extends { id: string }> = {
    rows: T[];
    columns: GridColDef<T>[];
    loading?: boolean;
};

const Table = <T extends { id: string }>({
    rows,
    columns,
    loading = false,
}: TableProps<T>) => {
    return (
        <Box
            sx={{
                width: '100%',
                '& .MuiDataGrid-root': {
                    border: 'none',
                    borderRadius: 2,
                },
                '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'action.hover',
                    borderRadius: '8px 8px 0 0',
                },
                '& .MuiDataGrid-row:hover': {
                    bgcolor: 'action.hover',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                disableRowSelectionOnClick
                autoHeight
                sx={{ minHeight: 400 }}
            />
        </Box>
    );
};

export default Table;

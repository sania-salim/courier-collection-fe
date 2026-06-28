import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

type TableProps<T extends { id: string }> = {
    rows: T[];
    columns: GridColDef<T>[];
    loading?: boolean;
    pagination?: boolean;
};

const DEFAULT_PAGE_SIZE = 20;

const Table = <T extends { id: string }>({
    rows,
    columns,
    loading = false,
    pagination = true,
}: TableProps<T>) => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: pagination ? DEFAULT_PAGE_SIZE : Math.max(rows.length, 1),
    });

    useEffect(() => {
        if (!pagination) {
            setPaginationModel({
                page: 0,
                pageSize: Math.max(rows.length, 1),
            });
        }
    }, [pagination, rows.length]);

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
                paginationModel={paginationModel}
                onPaginationModelChange={
                    pagination ? setPaginationModel : undefined
                }
                pageSizeOptions={pagination ? [10, 20, 50] : []}
                hideFooter={!pagination}
                disableRowSelectionOnClick
                autoHeight
                sx={{ minHeight: 400 }}
            />
        </Box>
    );
};

export default Table;

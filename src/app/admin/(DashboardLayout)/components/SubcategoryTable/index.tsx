'use client';

import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Checkbox,
  TextField, Typography, Paper,
  Stack, Button, CircularProgress,
} from '@mui/material';
import {
  IconArrowUp, IconArrowDown, IconArrowsSort,
  IconTrashX, IconSearch,
} from '@tabler/icons-react';

// ---------------------------------------------------------------------------
// Типи
// ---------------------------------------------------------------------------

export interface GenericTableProps<TData extends { id: number }> {
  data: TData[];
  total: number;
  columns: ColumnDef<TData>[];
  sortableColumns?: string[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSearchChange?: (val: string) => void;
  onSortChange?: (col: string, dir: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onBulkDelete?: (ids: number[]) => Promise<void>;
  emptyText?: string;
  rowsPerPageOptions?: number[];
}

// ---------------------------------------------------------------------------
// Компонент
// ---------------------------------------------------------------------------

export default function GenericTable<TData extends { id: number }>({
  data,
  total,
  columns: externalColumns = [], // ✅ ось це треба додати
  sortableColumns = [],
  loading = false,
  page = 0,
  pageSize = 15,
  search = '',
  sortBy = '',
  order = 'desc',
  onSearchChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onBulkDelete,
  emptyText = 'Даних не знайдено',
  rowsPerPageOptions = [10, 15, 25, 50],
}: GenericTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchInput, setSearchInput] = useState<string>(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const selectedCount = Object.keys(rowSelection).length;

  const handleSortClick = (colId: string): void => {
    if (!onSortChange) return;
    if (sortBy === colId) {
      onSortChange(colId, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(colId, 'desc');
    }
  };

  const handleBulkDelete = async (): Promise<void> => {
    if (!onBulkDelete) return;
    const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    if (!confirm(`Видалити ${ids.length} записів?`)) return;
    await onBulkDelete(ids);
    setRowSelection({});
  };

  const columns: ColumnDef<TData>[] = [
    {
      id: 'select',
      header: ({ table: t }) => (
        <Checkbox
          size="small"
          checked={t.getIsAllPageRowsSelected()}
          indeterminate={t.getIsSomePageRowsSelected()}
          onChange={t.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          size="small"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 48,
    },
    ...externalColumns,
  ];

  const table = useReactTable<TData>({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(total / pageSize),
    getRowId: (row) => String(row.id),
  });

  return (
    <Box maxWidth={1920} mx="auto">
      {/* Toolbar */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        {onSearchChange && (
          <TextField
            size="small"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchChange(searchInput);
            }}
            InputProps={{
              startAdornment: (
                <IconSearch
                  size={16}
                  style={{ marginRight: 4, color: 'var(--mui-palette-text-secondary)', cursor: 'pointer' }}
                  onClick={() => onSearchChange(searchInput)}
                />
              ),
            }}
            sx={{ width: 260 }}
          />
        )}

        {selectedCount > 0 && onBulkDelete && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<IconTrashX size={16} />}
            onClick={handleBulkDelete}
          >
            Delete selected ({selectedCount})
          </Button>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {loading ? 'loading...' : `Total: ${total}`}
        </Typography>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ position: 'relative' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.6)', zIndex: 1,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}

        <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 600 }}>
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} sx={{ bgcolor: 'grey.50' }}>
                {hg.headers.map((header) => {
                  const colId = header.column.id;
                  const isSortable = sortableColumns.includes(colId);
                  const isActive = sortBy === colId;

                  return (
                    <TableCell
                      key={header.id}
                      sx={{
                        width: header.getSize(),
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: isSortable ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => isSortable && handleSortClick(colId)}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          isActive
                            ? order === 'asc'
                              ? <IconArrowUp size={14} />
                              : <IconArrowDown size={14} />
                            : <IconArrowsSort size={14} color="var(--mui-palette-text-disabled)" />
                        )}
                      </Stack>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={row.getIsSelected()}
                  sx={{ '&.Mui-selected': { bgcolor: 'primary.50' } }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{ py: 1 }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={(_: unknown, p: number) => onPageChange?.(p)}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onPageSizeChange?.(Number(e.target.value))
        }
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
      />
    </Box>
  );
}
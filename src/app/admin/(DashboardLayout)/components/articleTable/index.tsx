'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Checkbox, Chip,
  IconButton, TextField, Tooltip, Typography, Paper,
  Avatar, Stack, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import {
  IconArrowUp, IconArrowDown, IconArrowsSort,
  IconEdit, IconTrash, IconTrashX, IconSearch, IconCopy,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

export interface Article {
  id: number;
  slug: string;
  title: string;
  lang: string;
  authorName: string;
  authorId: number;
  categoryId: number;
  imageId: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  category: { id: number; name: string; slug: string } | null;
  subcategories: { id: number; name: string; slug: string }[];
  author: { id: number; name: string } | null;
}

interface ArticleTableProps {
  data: Article[];
  total: number;
  loading?: boolean;
  // Серверні параметри
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSearchChange?: (val: string) => void;
  onSortChange?: (col: string, dir: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
    userRole?: string;
  userId?: number;
}

export default function ArticleTable({
  data,
  total,
  loading = false,
  page = 0,
  pageSize = 15,
  search = '',
  sortBy = 'createdAt',
  order = 'desc',
  onSearchChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  userRole,
  userId
}: ArticleTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchInput, setSearchInput] = useState(search);
  const [tableData, setTableData] = useState<Article[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (searchInput.length === 0 || searchInput.length >= 3) {
      const timer = setTimeout(() => {
        onSearchChange?.(searchInput);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchInput]);

  const selectedCount = Object.keys(rowSelection).length;

  const handleTogglePublish = async (id: number, currentPublished: boolean) => {
    const action = currentPublished ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this article?`)) return;

    try {
      const res = await fetch('/api/articles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? `Error ${res.status}`);
      }
      setTableData((prev) =>
        prev.map((a) => a.id === id ? { ...a, published: !a.published } : a)
      );
    } catch (err: any) {
      alert(err.message ?? 'Failed to update publish status');
    }
  };

  const handleSortClick = (colId: string) => {
    if (!onSortChange) return;
    if (sortBy === colId) {
      onSortChange(colId, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(colId, 'desc');
    }
  };

  const handleDuplicate = (slug: string) => {
    router.push(`/admin/production/articles/create?duplicate=${slug}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? `Error ${res.status}`);
      }
      setTableData((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? 'Failed to delete article');
    }
  };

  const handleBulkDelete = async () => {
    const rows = table.getSelectedRowModel().rows;
    const ids = rows.map((r) => r.original.id);
    if (!confirm(`Are you sure you want to delete ${ids.length} articles?`)) return;
    try {
      const results = await Promise.all(
        rows.map((r) => fetch(`/api/articles/${r.original.id}`, { method: 'DELETE' }))
      );
      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        throw new Error(`${failed.length} of ${ids.length} articles could not be deleted`);
      }
      setTableData((prev) => prev.filter((a) => !ids.includes(a.id)));
      setRowSelection({});
      router.refresh();
    } catch (err: any) {
      alert(err.message ?? 'Failed to delete articles');
    }
  };

  const sortableColumns = ['title', 'updatedAt', 'published', 'lang'];

  const columns: ColumnDef<Article>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          size="small"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox size="small" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      ),
      size: 48,
    },
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Avatar
          src={(row.original as any).image?.url ?? undefined}
          variant="rounded"
          sx={{ width: 48, height: 36, bgcolor: 'grey.200', fontSize: 12 }}
        >
          {!row.original.imageId && '—'}
        </Avatar>
      ),
      size: 64,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 220 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 200,
    },
    {
      id: 'author',
      header: 'Author',
      accessorFn: (row) =>row.authorName ?? row.author?.name ,
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 120,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated date',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {format(new Date(getValue() as string), 'dd.MM.yy HH:mm')}
        </Typography>
      ),
      size: 130,
    },
    {
      accessorKey: 'published',
      header: 'Status',
      cell: ({ row }) => {
        const published = row.original.published;
        return (
          <Chip
            label={published ? 'Published' : 'Draft'}
            size="small"
            color={published ? 'success' : 'default'}
            variant="outlined"
            onClick={() => handleTogglePublish(row.original.id, published)}
            sx={{ cursor: 'pointer' }}
          />
        );
      },
      size: 130,
    },
    {
      accessorKey: 'lang',
      header: 'Language',
      cell: ({ getValue }) => (
        <Chip label={getValue() as string} size="small" variant="filled" sx={{ fontWeight: 600, fontSize: 11 }} />
      ),
      size: 64,
    },
    {
      id: 'category',
      header: 'Category',
      accessorFn: (row) => row.category?.name ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap>{getValue() as string}</Typography>
      ),
      size: 100,
    },
    {
      id: 'subcategory',
      header: 'Subcategory',
      accessorFn: (row) => row.subcategories?.map((s) => s.name).join(', ') || '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 150,
    },
    {
      id: 'actions',
      header: '',
        // в колонці actions:
          cell: ({ row }) => (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Duplicate">
                <IconButton size="small" onClick={() => handleDuplicate(row.original.slug)}>
                  <IconCopy size={16} />
                </IconButton>
              </Tooltip>
              {(userRole === 'ADMIN' || userRole === 'OWNER' || userRole === 'EDITOR') && (
                <Tooltip title="Edit">
                  <IconButton size="small" href={`/admin/production/articles/${row.original.slug}/edit`}>
                    <IconEdit size={16} />
                  </IconButton>
                </Tooltip>
              )}
              {(userRole === 'ADMIN' || userRole === 'OWNER') && (
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => handleDelete(row.original.id)}>
                    <IconTrash size={16} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ),
      size: (userRole === 'ADMIN' || userRole === 'OWNER') ? 100 : 30,
    },
  ];

  const filteredColumns = columns.filter((col: any) => {
    if (col.accessorKey === 'published' && userRole === 'USER') return false;
    return true;
  });

  const table = useReactTable({
    data: tableData,
    columns: filteredColumns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(total / pageSize),
  });

  return (
      <Box maxWidth={1920} mx="auto">
      {/* Toolbar */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        <TextField
          size="small"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconSearch
                size={16}
                style={{ marginRight: 4, color: 'var(--mui-palette-text-secondary)', cursor: 'pointer' }}
                onClick={() => onSearchChange?.(searchInput)}
              />
            ),
          }}
          sx={{ width: 260 }}
        />

        {selectedCount > 0 && (userRole === 'ADMIN' || userRole === 'OWNER') && (
          <Button variant="outlined" color="error" size="small" startIcon={<IconTrashX size={16} />} onClick={handleBulkDelete}>
            Delete selected ({selectedCount})
          </Button>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {loading ? 'Loading...' : `Total: ${total}`}
        </Typography>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ position: 'relative' }}>
        {loading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)', zIndex: 1 }}>
            <CircularProgress size={32} />
          </Box>
        )}
        <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 900 }}>
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
                      sx={{ width: header.getSize(), fontWeight: 600, fontSize: 12, cursor: isSortable ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}
                      onClick={() => isSortable && handleSortClick(colId)}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {isSortable && (
                          isActive
                            ? order === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />
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
                  Articles not found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover selected={row.getIsSelected()} sx={{ '&.Mui-selected': { bgcolor: 'primary.50' } }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{ py: 1 }}>
                      {cell.column.id === 'title' ? (
                        <Link href={`/admin/production/articles/${row.original.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Link>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
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
        rowsPerPageOptions={[10, 15, 25, 50]}
        onPageChange={(_, p) => onPageChange?.(p)}
        onRowsPerPageChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
      />
    </Box>
  );
}
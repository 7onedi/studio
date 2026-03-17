'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Checkbox, Chip,
  IconButton, TextField, Tooltip, Typography, Paper,
  Avatar, Stack, Button, CircularProgress,
} from '@mui/material';
import {
  IconArrowUp, IconArrowDown, IconArrowsSort,
  IconEdit, IconTrash, IconTrashX, IconSearch,
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
}: ArticleTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchInput, setSearchInput] = useState(search);

  const selectedCount = Object.keys(rowSelection).length;

  const handleSortClick = (colId: string) => {
    if (!onSortChange) return;
    if (sortBy === colId) {
      onSortChange(colId, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(colId, 'desc');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити статтю?')) return;
    try {
      const article = data.find((a) => a.id === id);

      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Помилка ${res.status}`);

      if (article?.imageId) {
        await fetch(`/api/media/${article.imageId}`, { method: 'DELETE' });
      }

      router.refresh();
    } catch (err: any) {
      console.error('Помилка видалення:', err.message);
    }
  };

  const handleBulkDelete = async () => {
    const rows = table.getSelectedRowModel().rows;
    const ids = rows.map((r) => r.original.id);
    if (!confirm(`Видалити ${ids.length} статей?`)) return;
    try {
      await Promise.all(
        rows.map(async (r) => {
          await fetch(`/api/articles/${r.original.id}`, { method: 'DELETE' });
          if (r.original.imageId) {
            await fetch(`/api/media/${r.original.imageId}`, { method: 'DELETE' });
          }
        })
      );
      setRowSelection({});
      router.refresh();
    } catch (err: any) {
      console.error('Помилка bulk delete:', err.message);
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
      header: 'Заставка',
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
      header: 'Назва',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 220 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 200,
    },
    {
      id: 'author',
      header: 'Автор',
      accessorFn: (row) => row.author?.name ?? row.authorName,
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 120,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Оновлено',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {format(new Date(getValue() as string), 'dd.MM.yyyy HH:mm')}
        </Typography>
      ),
      size: 130,
    },
    {
      accessorKey: 'published',
      header: 'Статус',
      cell: ({ getValue }) => (
        <Chip
          label={(getValue() as boolean) ? 'Опубліковано' : 'Чернетка'}
          size="small"
          color={(getValue() as boolean) ? 'success' : 'default'}
          variant="outlined"
        />
      ),
      size: 130,
    },
    {
      accessorKey: 'lang',
      header: 'Мова',
      cell: ({ getValue }) => (
        <Chip label={getValue() as string} size="small" variant="filled" sx={{ fontWeight: 600, fontSize: 11 }} />
      ),
      size: 72,
    },
    {
      id: 'category',
      header: 'Категорія',
      accessorFn: (row) => row.category?.name ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap>{getValue() as string}</Typography>
      ),
      size: 150,
    },
    {
      id: 'subcategory',
      header: 'Підкатегорія',
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
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Редагувати">
            <IconButton size="small" href={`/admin/production/articles/${row.original.slug}/edit`}>
              <IconEdit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Видалити">
            <IconButton size="small" color="error" onClick={() => handleDelete(row.original.id)}>
              <IconTrash size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      size: 80,
    },
  ];

  const table = useReactTable({
    data,
    columns,
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
          placeholder="Пошук..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchChange?.(searchInput)}
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

        {selectedCount > 0 && (
          <Button variant="outlined" color="error" size="small" startIcon={<IconTrashX size={16} />} onClick={handleBulkDelete}>
            Видалити вибрані ({selectedCount})
          </Button>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {loading ? 'Завантаження...' : `Всього: ${total}`}
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
                  Статей не знайдено
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
        labelRowsPerPage="Рядків:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} з ${count}`}
      />
    </Box>
  );
}
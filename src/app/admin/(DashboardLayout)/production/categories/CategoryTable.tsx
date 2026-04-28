'use client';

import { useState } from 'react';
import { Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import GenericTable from '../../components/SubcategoryTable';
import { Category } from './CategoryFormDialog';

interface Props {
  data: Category[];
  total: number;
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
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => Promise<void>;
}

export default function CategoryTable({
  data, total, loading, page, pageSize, search, sortBy, order,
  onSearchChange, onSortChange, onPageChange, onPageSizeChange,
  onEdit, onDelete, onBulkDelete,
}: Props) {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Назва',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500}>{getValue() as string}</Typography>
      ),
      size: 250,
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 250,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Редагувати">
            <IconButton size="small" onClick={() => onEdit(row.original)}>
              <IconEdit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Видалити">
            <IconButton size="small" color="error" onClick={() => onDelete(row.original.id)}>
              <IconTrash size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      size: 80,
    },
  ];

  return (
    <GenericTable<Category>
      data={data}
      total={total}
      columns={columns}
      sortableColumns={['name']}
      loading={loading}
      page={page}
      pageSize={pageSize}
      search={search}
      sortBy={sortBy}
      order={order}
      onSearchChange={onSearchChange}
      onSortChange={onSortChange}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onBulkDelete={onBulkDelete}
      emptyText="Категорій не знайдено"
    />
  );
}
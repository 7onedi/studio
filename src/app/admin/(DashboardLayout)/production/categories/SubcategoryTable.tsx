'use client';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import GenericTable from '../../components/SubcategoryTable';
import { Subcategory } from './SubcategoryFormDialog';
import { Category } from './CategoryFormDialog';

interface Props {
  categories: Category[];
  data: Subcategory[];
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
  onEdit: (sub: Subcategory) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => Promise<void>;
}

export default function SubcategoryTable({
  data, total, loading, page, pageSize, search, sortBy, order,
  onSearchChange, onSortChange, onPageChange, onPageSizeChange,
  onEdit, onDelete, onBulkDelete, categories,
}: Props) {
  const columns: ColumnDef<Subcategory>[] = [
    {
      accessorKey: 'name',
      header: 'Назва',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500}>{getValue() as string}</Typography>
      ),
      size: 220,
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 220,
    },
    {
      id: 'category',
      header: 'Категорія',
      cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {categories.find((c) => c.id === row.original.categoryId)?.name ?? '—'}
          </Typography>
        ),
      size: 180,
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
    <GenericTable<Subcategory>  // ← передаємо лише те що є в GenericTableProps
      data={data}
      total={total}
      columns={columns}        // ← onEdit/onDelete вже всередині columns
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
      onBulkDelete={onBulkDelete}  // ← це є в GenericTableProps
      emptyText="Підкатегорій не знайдено"
    />
  );
}
'use client';

import { IconButton, Stack, Tooltip, Typography, Chip } from '@mui/material';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import GenericTable from '../../components/SubcategoryTable';
import { ParentProject } from './ParentProjectFormDialog';

interface Props {
  data: ParentProject[];
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
  onEdit: (project: ParentProject) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => Promise<void>;
  onPublish: (id: number, published: boolean) => void;
}

export default function ParentProjectTable({
  data, total, loading, page, pageSize, search, sortBy, order,
  onSearchChange, onSortChange, onPageChange, onPageSizeChange,
  onEdit, onDelete, onBulkDelete, onPublish,
}: Props) {
  const columns: ColumnDef<ParentProject>[] = [
    {
      accessorKey: 'title',
      header: 'Назва',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 200 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 220,
    },
    {
      id: 'category',
      header: 'Категорія',
      accessorFn: (row) => row.category?.name ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 180,
    },
    {
      accessorKey: 'published',
      header: 'Статус',
      cell: ({ row }) => (
        <Chip
          label={row.original.published ? 'Опубліковано' : 'Чернетка'}
          size="small"
          color={row.original.published ? 'success' : 'default'}
          variant="outlined"
          onClick={() => onPublish(row.original.id, row.original.published ?? false)}
          sx={{ cursor: 'pointer' }}
        />
      ),
      size: 130,
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
    <GenericTable<ParentProject>
      data={data}
      total={total}
      columns={columns}
      sortableColumns={['title', 'published']}
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
      emptyText="Проектів не знайдено"
    />
  );
}
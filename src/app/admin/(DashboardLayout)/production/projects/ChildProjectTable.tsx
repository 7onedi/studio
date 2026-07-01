'use client';

import { IconButton, Stack, Tooltip, Typography, Chip } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import GenericTable from '../../components/SubcategoryTable';
import { ChildProject } from './ChildProjectFormDialog';

interface Props {
  data: ChildProject[];
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
  onEdit: (project: ChildProject) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => Promise<void>;
  onPublish: (id: number, published: boolean) => void;
  userRole?: string;
}

const LANG_TO_COUNTRY: Record<string, string> = {
  UK: 'UA',
  EN: 'GB',
  PL: 'PL',
  LT: 'LT',
  RO: 'MD',
};

export default function ChildProjectTable({
  data, total, loading, page, pageSize, search, sortBy, order,
  onSearchChange, onSortChange, onPageChange, onPageSizeChange,
  onEdit, onDelete, onBulkDelete, onPublish, userRole,
}: Props) {
  const columns: ColumnDef<ChildProject>[] = [
    {
      accessorKey: 'title_en',
      header: 'Title',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 200 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 200,
    },
    {
      id: 'category',
      header: 'Category',
      accessorFn: (row) => row.category?.name ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 160,
    },
    {
      id: 'subcategory',
      header: 'Subcategory',
      accessorFn: (row) => row.subcategory?.name ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 160,
    },
    {
      id: 'parent',
      header: 'Parent Project',
      accessorFn: (row) => row.parent?.title ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 180,
    },
    {
      accessorKey: 'lang',
      header: 'Locale',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">
          {LANG_TO_COUNTRY[getValue() as string] ?? getValue() as string}
        </Typography>
      ),
      size: 130,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(row.original)}>
              <IconEdit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(row.original.id)}>
              <IconTrash size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      size: 80,
    },
  ];

  const filteredColumns = columns.filter((col: any) => {
    if (col.id === 'parent' && userRole !== 'OWNER') return false;
    return true;
  });

  return (
    <GenericTable<ChildProject>
      data={data}
      total={total}
      columns={filteredColumns}
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
      emptyText="No child projects found"
    />
  );
}
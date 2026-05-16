'use client';

import { Avatar, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import GenericTable from '../../components/SubcategoryTable';

export interface Partner {
  id: number;
  name: string;
  email: string;
  role: 'MEMBER' | 'DONOR' | 'PARTNER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description?: string | null;
  link?: string | null;
  published: boolean;
  publishedAt?: string | null;
  imageId?: number | null;
  image?: { id: number; url: string } | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLOR: Record<Partner['status'], 'warning' | 'success' | 'error'> = {
  PENDING:  'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

const STATUS_LABEL: Record<Partner['status'], string> = {
  PENDING:  'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

interface Props {
  data: Partner[];
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
  onEdit: (partner: Partner) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => Promise<void>;
}

export default function PartnersTable({
  data, total, loading, page, pageSize, search, sortBy, order,
  onSearchChange, onSortChange, onPageChange, onPageSizeChange,
  onEdit, onDelete, onBulkDelete,
}: Props) {
  const columns: ColumnDef<Partner>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as number}</Typography>
      ),
      size: 60,
    },
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Avatar
          src={row.original.image?.url ?? undefined}
          variant="rounded"
          sx={{ width: 48, height: 36, bgcolor: 'grey.200', fontSize: 12 }}
        >
          {!row.original.imageId && '—'}
        </Avatar>
      ),
      size: 64,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => (
        <Typography variant="body2" fontWeight={500}>{getValue() as string}</Typography>
      ),
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 200,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as Partner['status'];
        return <Chip label={STATUS_LABEL[s]} color={STATUS_COLOR[s]} size="small" />;
      },
      size: 120,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated date',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">
          {format(new Date(getValue() as string), 'dd.MM.yyyy HH:mm')}
        </Typography>
      ),
      size: 140,
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

  return (
    <GenericTable<Partner>
      data={data}
      total={total}
      columns={columns}
      sortableColumns={['name', 'email', 'status', 'updatedAt', 'createdAt']}
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
      emptyText="Partners not found"
    />
  );
}
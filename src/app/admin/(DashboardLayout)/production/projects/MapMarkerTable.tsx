'use client';

import { IconButton, Stack, Tooltip, Typography, Chip } from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import GenericTable from '../../components/SubcategoryTable';
import { MapMarkerProject } from './MapMarkerFormDialog';

interface Props {
  data: MapMarkerProject[];
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
  onEdit: (marker: MapMarkerProject) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => Promise<void>;
  onPublish: (id: number, published: boolean) => void;
  userRole?: string;
}

const MARKER_TYPE_LABEL: Record<string, string> = {
  IMAGEMAPPING: 'Imagemapping',
  HISTORICAL: 'Historical',
  NATURE: 'Nature',
};

export default function MapMarkerTable({
  data, total, loading, page, pageSize, search, sortBy, order,
  onSearchChange, onSortChange, onPageChange, onPageSizeChange,
  onEdit, onDelete, onBulkDelete, onPublish, userRole,
}: Props) {
  const columns: ColumnDef<MapMarkerProject>[] = [
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
      id: 'markerType',
      header: 'Type',
      accessorFn: (row) => row.markerType ?? '—',
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type !== '—'
          ? <Chip label={MARKER_TYPE_LABEL[type] ?? type} size="small" />
          : <Typography variant="body2" color="text.secondary">—</Typography>;
      },
      size: 140,
    },
    {
      id: 'subcategory',
      header: 'Subcategory',
      accessorFn: (row: any) => row.subcategory?.name ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 160,
    },
    {
      id: 'parent',
      header: 'Parent Project',
      accessorFn: (row: any) => row.parent?.title ?? '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
          {getValue() as string}
        </Typography>
      ),
      size: 180,
    },
    {
      id: 'coordinates',
      header: 'Coordinates',
      accessorFn: (row: any) =>
        row.location?.coordinates
          ? `${row.location.coordinates.lat?.toFixed(4)}, ${row.location.coordinates.lng?.toFixed(4)}`
          : '—',
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
      size: 150,
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
            onClick={() => onPublish(row.original.id, !!published)}
            sx={{ cursor: 'pointer' }}
          />
        );
      },
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

  return (
    <GenericTable<MapMarkerProject>
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
      emptyText="No markers found"
    />
  );
}
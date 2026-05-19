'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Box, Typography, Chip, IconButton, Stack, Tooltip,
  TextField, InputAdornment, MenuItem, Select, TablePagination,
} from '@mui/material';
import { IconSearch, IconEye, IconEdit } from '@tabler/icons-react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, Paper, CircularProgress,
} from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import FormControl from '@mui/material/FormControl';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  createdAt: string;
  updatedAt: string;
}

const ROLE_COLORS: Record<string, 'error' | 'primary' | 'success' | 'default'> = {
  ADMIN: 'error',
  EDITOR: 'primary',
  USER: 'success',
  VIEWER: 'default',
};

// ─── UsersContent ─────────────────────────────────────────────────────────────

function UsersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page   = searchParams.get('page')   ?? '1';
  const search = searchParams.get('search') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const order  = searchParams.get('order')  ?? 'desc';
  const limit  = searchParams.get('limit')  ?? '15';

  const [users, setUsers]     = useState<User[]>([]);
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  const handleRoleChange = async (id: number, role: User['role']) => {
  const prevUsers = users;

  // optimistic update
  setUsers((prev) =>
    prev.map((u) => (u.id === id ? { ...u, role } : u))
  );

  setUpdatingRoleId(id);

  try {
    const res = await fetch(`/api/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });

    if (!res.ok) throw new Error(`Помилка ${res.status}`);
  } catch (err) {
    console.error(err);

    // rollback якщо помилка
    setUsers(prevUsers);
  } finally {
    setUpdatingRoleId(null);
  }
};

  // Завантаження юзерів
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit, sortBy, order });
    if (search) params.set('email', search);
    fetch(`/api/users/search?${params}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setUsers(Array.isArray(d.data) ? d.data : []);
        setTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, limit, search, sortBy, order]);

  // Debounce пошуку
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParam('search', searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      updateParam('order', order === 'asc' ? 'desc' : 'asc');
    } else {
      updateParam('sortBy', col);
      updateParam('order', 'desc');
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">#{getValue() as number}</Typography>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/profile/${row.original.id}`)}
            >
              <Typography variant="body2" fontWeight={500}>{row.original.name}</Typography>
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 250,
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">{getValue() as string}</Typography>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;

        return (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              size="small"
              value={role}
              renderValue={(value) => (
                <Chip
                  label={value}
                  size="small"
                  color={ROLE_COLORS[value as User['role']]}
                />
              )}
              onChange={(e) =>
                handleRoleChange(
                  row.original.id,
                  e.target.value as User['role']
                )
              }
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            >
              {['USER', 'EDITOR', 'ADMIN'].map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated date',
      size: 160,
      cell: ({ getValue }) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(getValue() as string).toLocaleDateString('uk-UA')}
        </Typography>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/profile/${row.original.id}`)}
            >
              <IconEye size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: total,
  });

  const sortableColumns = ['name', 'email', 'createdAt'];

  return (
    <PageContainer title="Users" description="Manage application users, their roles and permissions.">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>Users</Typography>
        </Box>

        {/* Пошук */}
        <Box mb={2}>
          <TextField
            size="small"
            placeholder="Search by email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        {/* Таблиця */}
        <Paper variant="outlined">
          <TableContainer sx={{ position: 'relative', minHeight: 200 }}>
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
            <Table size="small">
              <TableHead>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        style={{ width: header.getSize() }}
                        sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                      >
                        {sortableColumns.includes(header.column.id) ? (
                          <TableSortLabel
                            active={sortBy === header.column.id}
                            direction={sortBy === header.column.id ? (order as 'asc' | 'desc') : 'asc'}
                            onClick={() => handleSort(header.column.id)}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableSortLabel>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} hover>
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

          <TablePagination
            component="div"
            count={total}
            page={Number(page) - 1}
            rowsPerPage={Number(limit)}
            rowsPerPageOptions={[10, 15, 25, 50]}
            onPageChange={(_, p) => updateParam('page', String(p + 1))}
            onRowsPerPageChange={(e) => updateParam('limit', e.target.value)}
            labelRowsPerPage="Rows:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
          />
        </Paper>
      </Box>
    </PageContainer>
  );
}

export default function UsersPage() {
  return (
    <Suspense>
      <UsersContent />
    </Suspense>
  );
}

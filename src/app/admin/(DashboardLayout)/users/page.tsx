'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Box, Typography, Chip, IconButton, Stack, Tooltip,
  TextField, InputAdornment, MenuItem, Select, TablePagination,
  Avatar
} from '@mui/material';
import { IconSearch, IconEye, IconEdit } from '@tabler/icons-react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, Paper, CircularProgress,
} from '@mui/material';
// додай в імпорти MUI:
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import FormControl from '@mui/material/FormControl';
import { IconUserPlus } from '@tabler/icons-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'USER' | 'OWNER';
  createdAt: string;
  updatedAt: string;
  avatar?: { url: string } | null;
}

const ROLE_COLORS: Record<string, 'error' | 'primary' | 'success' | 'default' | 'secondary'> = {
  ADMIN: 'error',
  EDITOR: 'primary',
  USER: 'success',
  OWNER: 'secondary',
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
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
  const [me, setMe] = useState<{ id: number; role: string } | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [ownerConfirm, setOwnerConfirm] = useState<{ open: boolean; id: number | null; }>({ open: false, id: null });

  const notify = (message: string, severity: 'success' | 'error' = 'success') => setSnackbar({ open: true, message, severity });

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  const handleRoleChange = async (id: number, role: User['role']) => {
    await applyRoleChange(id, role);
  };

  const applyRoleChange = async (id: number, role: User['role']) => {
    const prevUsers = users;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setUpdatingRoleId(id);

    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error(await res.text());
      notify(`Role changed to ${role}`);
    } catch (err: any) {
      setUsers(prevUsers);
      notify(err?.message ?? 'Failed to change role', 'error');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(setMe);
  }, []);

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

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      notify('Fill in all fields', 'error');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createForm),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setCreateDialog(false);
      setCreateForm({ name: '', email: '', password: '' });
      notify('User created successfully');
      router.push(`/admin/profile/${created.id}`);
    } catch (err: any) {
      notify(err?.message ?? 'Failed to create user', 'error');
    } finally {
      setCreating(false);
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
      id: 'avatar',
      header: '',
      size: 48,
      cell: ({ row }) => (
        <Avatar
          src={row.original.avatar?.url ?? undefined}
          sx={{ width: 32, height: 32 }}
        >
          {row.original.name?.[0]?.toUpperCase()}
        </Avatar>
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
        const canChangeRole = (target: User) => {
          if (!me) return false;
          if (target.id === me.id) return false;
          if (target.role === 'OWNER') return false;

          if (me.role === 'OWNER') return true;

          if (me.role === 'ADMIN') {
            return target.role !== 'ADMIN';
          }

          return false;
        };

        // Якщо не можна змінювати — просто показуємо чіп
        if (!canChangeRole(row.original)) {
          return (
            <Box sx={{ px: 1.5 }}>
              <Chip label={role} size="small" color={ROLE_COLORS[role]} />
            </Box>
          );
        }

        const availableRoles = me?.role === 'OWNER' ? ['USER', 'EDITOR', 'ADMIN'] : ['USER', 'EDITOR'];

        return (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              size="small"
              value={role}
              renderValue={(value) => (
                <Chip label={value} size="small" color={ROLE_COLORS[value as User['role']]} />
              )}
              onChange={(e) => handleRoleChange(row.original.id, e.target.value as User['role'])}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              {availableRoles.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
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
      size: 100,
      cell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Profile">
            <IconButton size="small" onClick={() => router.push(`/admin/profile/${row.original.id}`)}>
              <IconEye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Profile">
            <IconButton size="small" onClick={() => router.push(`/admin/profile/${row.original.id}?edit=1`)}>
              <IconEdit size={16} />
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
          {(me?.role === 'ADMIN' || me?.role === 'OWNER') && (
            <Button
              variant="contained"
              startIcon={<IconUserPlus size={16} />}
              onClick={() => router.push('/admin/profile/create')}
            >
              Create User
            </Button>
          )}
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

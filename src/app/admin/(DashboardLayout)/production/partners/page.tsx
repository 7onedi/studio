'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PageContainer from '../../components/container/PageContainer';
import PartnersTable, { Partner } from './PartnersTable';
import PartnerFormDialog from './PartnerFormDialog';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';

const ROLE_TABS: { label: string; value: 'MEMBER' | 'DONOR' | 'PARTNER' }[] = [
  { label: 'Member',   value: 'MEMBER'  },
  { label: 'Donor',  value: 'DONOR'   },
  { label: 'Partner', value: 'PARTNER' },
];

function PartnersContent() {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  const tab     = Number(searchParams.get('tab') ?? '0');
  const page    = searchParams.get('page')   ?? '1';
  const search  = searchParams.get('search') ?? '';
  const sortBy  = searchParams.get('sortBy') ?? 'updatedAt';
  const order   = searchParams.get('order')  ?? 'desc';
  const limit   = searchParams.get('limit')  ?? '15';

  const [partners, setPartners] = useState<Partner[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Partner | undefined>();

  

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`${pathname}?${params}`);
  };

  useEffect(() => {
    setLoading(true);
    const role = ROLE_TABS[tab]?.value ?? 'MEMBER';
    const params = new URLSearchParams({ page, limit, sortBy, order, role });
    if (search) params.set('name', search);

    fetch(`/api/partners/search?${params}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setPartners(Array.isArray(d.data) ? d.data : []);
        setTotal(d.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab, page, limit, search, sortBy, order]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete partner?')) return;
    const res = await fetch(`/api/partners/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) return;
    setPartners((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleBulkDelete = async (ids: number[]) => {
    await Promise.all(
      ids.map((id) => fetch(`/api/partners/${id}`, { method: 'DELETE', credentials: 'include' }))
    );
    setPartners((prev) => prev.filter((p) => !ids.includes(p.id)));
    setTotal((prev) => prev - ids.length);
  };

  const handleEdit = (partner: Partner) => {
    setEditTarget(partner);
    setFormOpen(true);
  };

    const handleSaved = (saved: Partner) => {
    const currentRole = ROLE_TABS[tab]?.value;
    if (saved.role !== currentRole) {
        // не належить до поточного табу
        setPartners((prev) => prev.filter((p) => p.id !== saved.id));
        setTotal((t) => Math.max(0, t - 1));
        return;
    }
    setPartners((prev) => {
        const exists = prev.find((p) => p.id === saved.id);
        if (exists) return prev.map((p) => p.id === saved.id ? saved : p);
        setTotal((t) => t + 1);
        return [saved, ...prev];
    });
    };

  return (
    <PageContainer title="Partners" description="Management partners">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>Partners</Typography>
        </Box>
        

        <Tabs
          value={tab}
          onChange={(_, v) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('tab', String(v));
            params.set('page', '1');
            params.delete('search');
            router.push(`${pathname}?${params}`);
          }}
          sx={{ mb: 3 }}
        >
          {ROLE_TABS.map(({ label }) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>Partners</Typography>
            <Button
                variant="contained"
                startIcon={<IconPlus size={16} />}
                onClick={() => { setEditTarget(undefined); setFormOpen(true); }}
            >
                New {ROLE_TABS[tab]?.label}
            </Button>
        </Box>

        <PartnersTable
            data={partners}
            total={total}
            loading={loading}
            page={Number(page) - 1}
            pageSize={Number(limit)}
            search={search}
            sortBy={sortBy}
            order={order as 'asc' | 'desc'}
            onSearchChange={(val) => updateParam('search', val)}
            onSortChange={(col, dir) => { updateParam('sortBy', col); updateParam('order', dir); }}
            onPageChange={(p) => updateParam('page', String(p + 1))}
            onPageSizeChange={(size) => updateParam('limit', String(size))}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
        />

        <PartnerFormDialog
            open={formOpen}
            initial={editTarget}
            defaultRole={ROLE_TABS[tab]?.value} 
            onClose={() => setFormOpen(false)}
            onSaved={handleSaved}
        />
      </Box>
    </PageContainer>
  );
}

export default function PartnersPage() {
  return (
    <Suspense>
      <PartnersContent />
    </Suspense>
  );
}
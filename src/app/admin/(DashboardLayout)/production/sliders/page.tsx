'use client';

import { Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import SliderManager from '../../components/SliderManager';

const LANGS = [
  { code: 'EN', icon: '/flags/GB.svg', label: 'English' },
  { code: 'UK', icon: '/flags/UA.svg', label: 'Ukrainian' },
  { code: 'PL', icon: '/flags/PL.svg', label: 'Polish' },
  { code: 'LT', icon: '/flags/LT.svg', label: 'Lithuanian' },
  { code: 'RO', icon: '/flags/RO.svg', label: 'Romanian' },
];

function SlidersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') ?? 'EN';

  return (
    <PageContainer title="Sliders" description="Banner and Carousel sliders">
      <Typography variant="h5" fontWeight={600} mb={3}>Sliders</Typography>
      <Tabs value={lang} onChange={(_, v) => router.push(`${pathname}?lang=${v}`)} sx={{ mb: 3 }}>
        {LANGS.map((l) => (
          <Tab
            key={l.code}
            value={l.code}
            label={
              <Box display="flex" alignItems="center" gap={0.75}>
                <img src={l.icon} width={24} height={24} alt={l.label} style={{ borderRadius: 2 }} />
                {l.label}
              </Box>
            }
          />
        ))}
      </Tabs>
      <SliderManager lang={lang} />
    </PageContainer>
  );
}

export default function SlidersPage() {
  return (
    <Suspense>
      <SlidersContent />
    </Suspense>
  );
}
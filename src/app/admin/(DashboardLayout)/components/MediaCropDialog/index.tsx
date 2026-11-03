'use client';

import { useRef, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Tabs, Tab, Slider, Typography,
} from '@mui/material';
import { IconCheck } from '@tabler/icons-react';
import type { MediaItem, MediaCrop } from '../Mediapickerdialog';

type Variant = 'desktop' | 'mobile';
const VARIANTS: Variant[] = ['desktop', 'mobile'];
const ASPECT: Record<Variant, number> = { desktop: 16 / 9, mobile: 9 / 16 };
const LABEL: Record<Variant, string> = { desktop: 'Desktop', mobile: 'Mobile' };
const other = (v: Variant): Variant => (v === 'desktop' ? 'mobile' : 'desktop');

const same = (a?: MediaCrop | null, b?: MediaCrop | null) =>
  (!a && !b) || (!!a && !!b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height);

interface Props {
  media: MediaItem | null;
  fresh?: boolean;
  onClose: () => void;
  onSaved: (media: MediaItem) => void;
}

export default function MediaCropDialog({ media, fresh, onClose, onSaved }: Props) {
  return (
    <Dialog open={!!media} onClose={onClose} maxWidth="md" fullWidth>
      {media && <Inner key={media.id} media={media} fresh={fresh} onClose={onClose} onSaved={onSaved} />}
    </Dialog>
  );
}

function Inner({ media, fresh, onClose, onSaved }: { media: MediaItem } & Omit<Props, 'media'>) {
  const saved: Record<Variant, MediaCrop | null> = {
    desktop: media.cropDesktop ?? null,
    mobile: media.cropMobile ?? null,
  };
  const [tab, setTab] = useState<Variant>(saved.desktop && !saved.mobile ? 'mobile' : 'desktop');
  const [crops, setCrops] = useState(saved);
  const [confirmed, setConfirmed] = useState<Record<Variant, boolean>>({
    desktop: !!saved.desktop,
    mobile: !!saved.mobile,
  });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const natural = useRef({ w: 0, h: 0 });

  const src = encodeURI(media.url);
  const dirty = VARIANTS.some((v) => !same(crops[v], saved[v]));
  const allConfirmed = confirmed.desktop && confirmed.mobile;
  const cur = crops[tab];
  const locked = confirmed[tab];

  const changeTab = (v: Variant) => {
    setTab(v);
    setPos({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropComplete = (_: Area, px: Area) => {
    const { w, h } = natural.current;
    const x = Math.max(0, Math.round(px.x));
    const y = Math.max(0, Math.round(px.y));
    const width = Math.round(px.width);
    const height = Math.round(px.height);
    setCrops((c) => ({
      ...c,
      [tab]: {
        x,
        y,
        width: w ? Math.min(width, w - x) : width,
        height: h ? Math.min(height, h - y) : height,
      },
    }));
  };

  const confirm = () => {
    setConfirmed((c) => ({ ...c, [tab]: true }));
    const next = other(tab);
    if (!confirmed[next]) changeTab(next);
  };

  const unlock = () => setConfirmed((c) => ({ ...c, [tab]: false }));

  const save = async () => {
    const body: Partial<Record<Variant, MediaCrop | null>> = {};
    VARIANTS.forEach((v) => { if (!same(crops[v], saved[v])) body[v] = crops[v]; });
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/media/${media.id}/crop`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      onSaved(await res.json());
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  const hint = allConfirmed
    ? 'Both crops are fixed. You can save now.'
    : confirmed[other(tab)]
      ? `${LABEL[other(tab)]} crop is fixed. Now set the ${LABEL[tab].toLowerCase()} crop.`
      : 'Set the crop and fix it. Save unlocks after both desktop and mobile are fixed.';

  return (
    <>
      <DialogTitle>{fresh ? 'Crop new image (optional)' : 'Crop image'}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => changeTab(v)} sx={{ mb: 1 }}>
          {VARIANTS.map((v) => (
            <Tab
              key={v}
              value={v}
              iconPosition="end"
              icon={confirmed[v] ? <IconCheck size={16} /> : undefined}
              label={LABEL[v]}
              sx={{ minHeight: 48 }}
            />
          ))}
        </Tabs>

        <Box sx={{ position: 'relative', height: 420, bgcolor: '#111', borderRadius: 1, overflow: 'hidden' }}>
          <Cropper
            key={tab}
            image={src}
            crop={pos}
            zoom={zoom}
            aspect={ASPECT[tab]}
            onCropChange={setPos}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={(m) => { natural.current = { w: m.naturalWidth, h: m.naturalHeight }; }}
            initialCroppedAreaPixels={cur ?? undefined}
          />
          {locked && (
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, bgcolor: 'rgba(0,0,0,0.35)' }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
          <Typography variant="caption">Zoom</Typography>
          <Slider
            size="small"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(_, v) => setZoom(v as number)}
            disabled={locked}
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {cur ? `${cur.width}×${cur.height}px` : ''}
          </Typography>
          {locked ? (
            <Button size="small" variant="outlined" onClick={unlock}>Edit</Button>
          ) : (
            <Button size="small" variant="contained" onClick={confirm} disabled={!cur}>
              Fix {LABEL[tab].toLowerCase()} crop
            </Button>
          )}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {hint}
        </Typography>
        {error && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">{fresh ? 'Skip' : 'Cancel'}</Button>
        <Button onClick={save} variant="contained" size="small" disabled={!allConfirmed || !dirty || saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </>
  );
}
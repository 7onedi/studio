'use client';
 
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, IconButton, Tooltip,
  CircularProgress, Pagination, Stack, TextField
} from '@mui/material';
import { IconUpload, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { FieldHelp } from '../shared/FieldHelp';
 
export interface MediaItem {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}
 
interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  selected?: number | null; // поточний вибраний id
}
 
const PAGE_SIZE = 24;

type Usage = { kind: 'article' | 'childProject' | 'project' | 'partner' | 'avatar'; id: number; title: string };

const KIND_COLOR: Record<Usage['kind'], string> = {
  article: '#ffffff',
  childProject: '#FFD600',
  project: '#FF9800',
  partner: '#69F0AE',
  avatar: '#CE93D8',
};
const KIND_ORDER: Usage['kind'][] = ['childProject', 'project', 'article', 'partner', 'avatar'];

const KIND_LABEL: Record<Usage['kind'], string> = {
  childProject: 'Project',
  project: 'Parent Project',
  article: 'Article',
  partner: 'Partner',
  avatar: 'Avatar',
};
 
export default function MediaPickerDialog({ open, onClose, onSelect, selected }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);
  const [usage, setUsage] = useState<Record<number, Usage[]>>({});
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = q.trim();
      setDebouncedQ(trimmed.length >= 3 ? trimmed : '');
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const focusedRef = useRef(false);

  useEffect(() => {
    if (!open) { focusedRef.current = false; setPage(1); }
  }, [open]);
 
  const fetchMedia = useCallback(async (p: number, query: string, focus?: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/media?page=${p}&limit=${PAGE_SIZE}&q=${encodeURIComponent(query)}${focus ? `&focus=${focus}` : ''}`
      );
      const d = await res.json();
      if (focus && d.page) setPage(d.page);
      setMedia(Array.isArray(d.data) ? d.data : []);
      setTotal(d.total ?? 0);
      const list = Array.isArray(d.data) ? d.data : [];
      if (list.length) {
        fetch(`/api/media/usage?ids=${list.map((m: MediaItem) => m.id).join(',')}`)
          .then((r) => r.json())
          .then((u) => setUsage((prev) => ({ ...prev, ...u })))
          .catch(console.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const focus = !focusedRef.current && selected && !debouncedQ ? selected : undefined;
    focusedRef.current = true;
    fetchMedia(page, debouncedQ, focus);
  }, [open, page, debouncedQ, fetchMedia]);
 
  useEffect(() => {
    if (open) fetchMedia(page, debouncedQ);
  }, [open, page, debouncedQ, fetchMedia]);
 
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media', { method: 'POST', body: fd, credentials: 'include' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const created = await res.json();
      // Додаємо на початок і вибираємо
      setMedia((prev) => [created, ...prev.slice(0, PAGE_SIZE - 1)]);
      setTotal((t) => t + 1);
      onSelect(created);
      onClose();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setUploading(false);
    }
  };
 
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleting(id);
    try {
      let list: Usage[] = usage[id] ?? [];
      try {
        const r = await fetch(`/api/media/usage?ids=${id}`, { credentials: 'include' });
        const u = await r.json();
        list = u[id] ?? [];
      } catch {}

      const text = list.length
        ? `⚠️ WARNING: this image is used in ${list.length} place(s):\n\n` +
          KIND_ORDER.flatMap((kind) =>
            list.filter((u) => u.kind === kind).map((u) => `• [${KIND_LABEL[kind]}] ${u.title}`)
          ).join('\n') +
          `\n\nIf you delete it, the image will disappear from all of them. Delete anyway?`
        : 'Delete this image?';

      if (!confirm(text)) return;

      const res = await fetch(`/api/media/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      setTotal((t) => t - 1);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setDeleting(null);
    }
  };
 
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const qTooShort = q.trim().length > 0 && q.trim().length < 3;
 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="h6" fontWeight={600}>Media Library</Typography>
          <FieldHelp>
            {KIND_ORDER.map((kind) => (
              <Box key={kind} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: KIND_COLOR[kind], border: '1px solid #888' }} />
                <Typography variant="body2">{KIND_LABEL[kind]}</Typography>
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary">
              No label on the image means it is not used anywhere.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Search starts from 3 characters.
            </Typography>
          </FieldHelp>
        </Box>
        <IconButton size="small" onClick={onClose}><IconX size={18} /></IconButton>
      </DialogTitle>
 
      <DialogContent sx={{ p: 2 }}>
        <TextField
          size="small"
          fullWidth
          autoFocus
          placeholder="Search by file name or by article / project / partner title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          error={qTooShort}
          helperText={qTooShort ? 'Minimum 3 characters' : ' '}
          sx={{ mb: 1 }}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 1,
              }}
            >
              {/* Upload box — перший квадрат */}
              <Box
                component="label"
                sx={{
                  aspectRatio: '1',
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: uploading ? 'wait' : 'pointer',
                  bgcolor: 'primary.50',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: 'primary.100' },
                  gap: 0.5,
                }}
              >
                {uploading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <IconUpload size={24} color="var(--mui-palette-primary-main)" />
                    <Typography variant="caption" color="primary" fontWeight={600} textAlign="center">
                      Upload
                    </Typography>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = '';
                  }}
                />
              </Box>
 
              {/* Медіа квадрати */}
              {media.map((item) => {
                const isSelected = selected === item.id;
                const isDeleting = deleting === item.id;
                const isHovered = hovering === item.id;
 
                return (
                  <Box
                    key={item.id}
                    onClick={() => { onSelect(item); onClose(); }}
                    onMouseEnter={() => setHovering(item.id)}
                    onMouseLeave={() => setHovering(null)}
                    sx={{
                      aspectRatio: '1',
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: isSelected ? 'primary.main' : 'transparent',
                      outline: isSelected ? '2px solid' : 'none',
                      outlineColor: 'primary.light',
                      transition: 'all 0.15s',
                      '&:hover': { transform: 'scale(1.02)', boxShadow: 3 },
                    }}
                  >
                    {/* Thumbnail з зменшеним розміром через URL params якщо підтримується, інакше CSS */}
                    <Box
                      component="img"
                      src={`/api/media/${item.id}/thumb`}
                      alt={item.filename}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                      {usage[item.id]?.length > 0 && (
                        <Box
                          sx={{
                            position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
                            py: 0.5, px: 0.5, textAlign: 'center', pointerEvents: 'none',
                            bgcolor: 'rgba(0,0,0,0.15)',
                            borderTop: '1px solid rgba(255,255,255,0.8)',
                            borderBottom: '1px solid rgba(255,255,255,0.8)',
                          }}
                        >
                          {KIND_ORDER.map((kind) => {
                            const list = usage[item.id].filter((u) => u.kind === kind);
                            if (!list.length) return null;
                            return (
                              <Typography
                                key={kind}
                                variant="caption"
                                noWrap
                                sx={{
                                  display: 'block', color: KIND_COLOR[kind], fontWeight: 600, lineHeight: 1.3,
                                  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                                }}
                              >
                                {list[0].title}{list.length > 1 && ` +${list.length - 1}`}
                              </Typography>
                            );
                          })}
                        </Box>
                      )}
 
                    {/* Overlay при hover */}
                    {(isHovered || isDeleting) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: 'rgba(0,0,0,0.35)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-end',
                          p: 0.5,
                        }}
                      >
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => handleDelete(e, item.id)}
                            disabled={isDeleting}
                            sx={{
                              bgcolor: 'error.main',
                              color: 'white',
                              width: 22,
                              height: 22,
                              '&:hover': { bgcolor: 'error.dark' },
                            }}
                          >
                            {isDeleting
                              ? <CircularProgress size={12} color="inherit" />
                              : <IconTrash size={12} />
                            }
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
 
                    {/* Checkmark якщо вибрано */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconCheck size={12} color="white" />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
 
            {/* Пагінація */}
            {totalPages > 1 && (
              <Stack alignItems="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  size="small"
                  color="primary"
                />
              </Stack>
            )}
          </>
        )}
      </DialogContent>
 
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
          {total} images total
        </Typography>
        <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
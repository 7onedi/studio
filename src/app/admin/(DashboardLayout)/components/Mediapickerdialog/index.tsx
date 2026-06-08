'use client';
 
import { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, IconButton, Tooltip,
  CircularProgress, Pagination, Stack,
} from '@mui/material';
import { IconUpload, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
 
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
 
export default function MediaPickerDialog({ open, onClose, onSelect, selected }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);
 
  const fetchMedia = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?page=${p}&limit=${PAGE_SIZE}`);
      const d = await res.json();
      setMedia(Array.isArray(d.data) ? d.data : []);
      setTotal(d.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    if (open) fetchMedia(page);
  }, [open, page, fetchMedia]);
 
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
    if (!confirm('Delete this image?')) return;
    setDeleting(id);
    try {
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
 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>Media Library</Typography>
        <IconButton size="small" onClick={onClose}><IconX size={18} /></IconButton>
      </DialogTitle>
 
      <DialogContent sx={{ p: 2 }}>
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
                      src={item.url}
                      alt={item.filename}
                      loading="lazy"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        // Зменшуємо рендер розмір — браузер не декодує повний розмір
                        imageRendering: 'auto',
                      }}
                      // Підказка браузеру завантажити маленьку версію
                      sizes="120px"
                    />
 
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
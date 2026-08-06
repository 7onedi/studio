'use client';

import { useState } from 'react';
import { Box, TextField, Stack, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { IconCheck, IconX } from '@tabler/icons-react';

interface Props {
  url: string;
  title: string;
  description: string;
  onUrlChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}

type ValidationStatus = 'idle' | 'checking' | 'valid' | 'invalid';

function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) ?? url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function PresentationUploader({
  url,
  title,
  description,
  onUrlChange,
  onTitleChange,
  onDescriptionChange,
}: Props) {
  const [status, setStatus] = useState<ValidationStatus>('idle');

  const isFormatValid = !url || /^https:\/\/drive\.google\.com\/.+/.test(url);

  const validateUrl = async (value: string) => {
    const fileId = extractDriveId(value);
    if (!value || !fileId) {
      setStatus(value ? 'invalid' : 'idle');
      return;
    }
    setStatus('checking');
    try {
      const res = await fetch(`/api/presentation-proxy/${fileId}`, {
        headers: { Range: 'bytes=0-0' },
      });
      setStatus(res.ok ? 'valid' : 'invalid');
    } catch {
      setStatus('invalid');
    }
  };

  const helperText =
    !isFormatValid ? 'Must be a drive.google.com link'
    : status === 'invalid' ? 'File is not accessible — check the link and sharing permissions'
    : status === 'valid' ? 'Link verified'
    : ' ';

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <TextField
          label="Google Drive link (presentation)"
          size="small"
          fullWidth
          value={url}
          onChange={(e) => {
            onUrlChange(e.target.value);
            setStatus('idle');
          }}
          onBlur={(e) => validateUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
          error={!isFormatValid || status === 'invalid'}
          helperText={helperText}
          slotProps={{
            input: {
                endAdornment: (
                <InputAdornment position="end">
                    {status === 'checking' && <CircularProgress size={16} />}
                    {status === 'valid' && <IconCheck size={18} color="green" />}
                    {status === 'invalid' && (
                    <IconButton
                        size="small"
                        onClick={() => {
                        onUrlChange('');
                        setStatus('idle');
                        }}
                    >
                        <IconX size={18} color="red" />
                    </IconButton>
                    )}
                </InputAdornment>
                ),
            },
          }}
        />
        <TextField
          label="Presentation title"
          size="small"
          fullWidth
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <TextField
          label="Presentation description"
          size="small"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </Stack>
    </Box>
  );
}
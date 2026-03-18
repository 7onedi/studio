'use client';

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface Block {
  id?: string;
  type: string;
  data: any;
}

interface Props {
  blocks: Block[];
}

function renderBlock(block: Block, index: number) {
  const { type, data } = block;

  switch (type) {
    case 'header':
      return (
        <Typography
          key={index}
          variant={`h${data.level}` as any}
          fontWeight={600}
          gutterBottom
          mt={2}
        >
          {data.text}
        </Typography>
      );

    case 'paragraph':
      return (
        <Typography
          key={index}
          variant="body1"
          gutterBottom
          sx={{ lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      );

    case 'list':
      const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <Box key={index} component={ListTag} sx={{ pl: 3, mb: 1.5 }}>
          {data.items?.map((item: string, i: number) => (
            <li key={i}>
              <Typography variant="body1" component="span" dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </Box>
      );

    case 'image':
      return (
        <Box key={index} my={2} textAlign={data.withBackground ? 'center' : 'left'}>
          <Box
            component="img"
            src={data.file?.url ?? data.url}
            alt={data.caption ?? ''}
            sx={{
              maxWidth: '100%',
              borderRadius: 1,
              ...(data.stretched && { width: '100%' }),
              ...(data.withBorder && { border: '1px solid', borderColor: 'divider' }),
              ...(data.withBackground && { bgcolor: 'grey.100', p: 2 }),
            }}
          />
          {data.caption && (
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              {data.caption}
            </Typography>
          )}
        </Box>
      );

      case 'gallery':
        return (
          <Box
            key={index}
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${data.files?.length ?? 1}, 1fr)`,
              gap: 1,
              my: 2,
            }}
          >
            {data.files?.map((file: any, i: number) => (
              <Box
                key={i}
                component="img"
                src={file.url}
                alt={data.caption ?? ''}
                sx={{ width: '100%', borderRadius: 1, objectFit: 'cover' }}
              />
            ))}
            {data.caption && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={0.5}
                sx={{ gridColumn: '1 / -1' }}
              >
                {data.caption}
              </Typography>
            )}
          </Box>
        );

    case 'quote':
      return (
        <Box
          key={index}
          component="blockquote"
          sx={{
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2,
            my: 2,
            ml: 0,
          }}
        >
          <Typography variant="body1" fontStyle="italic" dangerouslySetInnerHTML={{ __html: data.text }} />
          {data.caption && (
            <Typography variant="caption" color="text.secondary">
              — {data.caption}
            </Typography>
          )}
        </Box>
      );

    case 'code':
      return (
        <Box
          key={index}
          component="pre"
          sx={{
            bgcolor: 'grey.900',
            color: 'grey.100',
            p: 2,
            borderRadius: 1,
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: 14,
            my: 2,
          }}
        >
          <code>{data.code}</code>
        </Box>
      );

    case 'delimiter':
      return <Divider key={index} sx={{ my: 3 }} />;

    case 'table':
      return (
        <Box key={index} sx={{ overflowX: 'auto', my: 2 }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                fontSize: 14,
              },
              '& th': { bgcolor: 'grey.50', fontWeight: 600 },
            }}
          >
            <tbody>
              {data.content?.map((row: string[], rIdx: number) => (
                <tr key={rIdx}>
                  {row.map((cell: string, cIdx: number) => (
                    data.withHeadings && rIdx === 0
                      ? <th key={cIdx} dangerouslySetInnerHTML={{ __html: cell }} />
                      : <td key={cIdx} dangerouslySetInnerHTML={{ __html: cell }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      );

    case 'warning':
      return (
        <Box
          key={index}
          sx={{
            bgcolor: 'warning.50',
            border: '1px solid',
            borderColor: 'warning.200',
            borderRadius: 1,
            p: 2,
            my: 2,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="warning.dark">
            {data.title}
          </Typography>
          <Typography variant="body2" color="warning.dark" dangerouslySetInnerHTML={{ __html: data.message }} />
        </Box>
      );
    case 'embed':
      return (
        <Box key={index} my={2} sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <Box
            component="iframe"
            src={data.embed}
            title={data.caption ?? 'embed'}
            allowFullScreen
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 1,
            }}
          />
          {data.caption && (
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              {data.caption}
            </Typography>
          )}
        </Box>
      );

    default:
      return (
        <Box key={index} sx={{ my: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.disabled">
            [unknown block: {type}]
          </Typography>
        </Box>
      );
  }
}

export default function EditorJsViewer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) {
    return (
      <Typography color="text.secondary" fontStyle="italic">
        Контент відсутній
      </Typography>
    );
  }

  return (
    <Box>
      {blocks.map((block, index) => renderBlock(block, index))}
    </Box>
  );
}

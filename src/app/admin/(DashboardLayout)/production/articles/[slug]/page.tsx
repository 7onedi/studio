import { Box, Typography, Chip, Stack, Divider, Avatar } from '@mui/material';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import PageContainer from '../../../components/container/PageContainer';
import EditorJsViewer from '../../../components/EditorJsViewer';
import ArticleActions from '../../../components/ArticleActions';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

async function parseJSONSafe(res: Response) {
  try { return await res.json(); } catch { return null; }
}

interface PageProps {
  params: { slug: string };
}

export default async function ArticleSlugPage({ params }: PageProps) {
  const { slug } = params;

  const getBySlugRes = await fetch(
    `${BASE_URL}/api/articles/by-slug/${slug}`,
    { cache: 'no-store' },
  );

  const article = await parseJSONSafe(getBySlugRes);
  if (!article || !article.id) notFound();

  const bodyBlocks = article.body?.blocks ?? [];

  return (
    <PageContainer title={article.title} description={article.title}>
      <Box maxWidth={1200} mx="auto">

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" className='flex justify-between'>
          <Chip label={article.lang} size="small" variant="filled" sx={{ fontWeight: 600 }} />
          <Chip
            label={article.published ? 'Опубліковано' : 'Чернетка'}
            size="small"
            color={article.published ? 'success' : 'default'}
            variant="outlined"
          />
          {article.image?.url && (
            <Box
              component="img"
              src={article.image.url}
              alt={article.title}
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 3,
              }}
            />
          )}
          {article.category && (
            <Chip label={article.category.name} size="small" variant="outlined" />
          )}
          {article.subcategories?.map((s: any) => (
            <Chip key={s.id} label={s.name} size="small" variant="outlined" color="secondary" />
          ))}
          <ArticleActions id={article.id} slug={article.slug} />
        </Stack>


        <Typography variant="h4" fontWeight={700} mb={1} mt={2}>
          {article.title}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 13 }}>
            {(article.author?.name ?? article.authorName)?.[0]}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {article.author?.name ?? article.authorName}
          </Typography>
          <Typography variant="body2" color="text.disabled">·</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(article.updatedAt).toLocaleString('uk-UA')}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <EditorJsViewer blocks={bodyBlocks} />
      </Box>
    </PageContainer>
  );
}
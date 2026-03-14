import { Box, Typography, Button } from '@mui/material';
import {
  IconPlus,
} from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import ArticleTable from '../../components/articleTable';

const BASE_URL = "http://localhost:3000";

async function parseJSONSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ArticlesPage() {
const searchRes = await fetch(
  `${BASE_URL}/api/articles/search?page=1&limit=15&sortBy=createdAt&order=desc`,
);
const searchData = (await parseJSONSafe(searchRes)) || {};
const searchResults = Array.isArray(searchData.data) ? searchData.data : [];

console.log("SEARCH:", searchResults.length, "articles found");
console.log("TOTAL found:", searchData.total ?? 0);
console.log("Current page:", searchData.page ?? 1, "/", searchData.pages ?? 1);

// Додатково лог id та title
console.log(
  "Found IDs:",
  searchResults.map((a: any) => a.id)
);
console.log(
  "Found Titles:",
  searchResults.map((a: any) => a.title)
);

  const total: number = searchData.total ?? 0;

  return (
    <PageContainer title="Статті" description="Список статей">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Статті
          </Typography>
          <Button
            variant="contained"
            startIcon={<IconPlus size={16} />}
            href="/admin/production/articles/create"
          >
            Нова стаття
          </Button>
        </Box>

        <ArticleTable data={searchResults} total={total} />
      </Box>
    </PageContainer>
  );
}

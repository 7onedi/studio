'use client';

import { Suspense } from 'react';
import ArticlesContent from '../../components/ArticlesContent';

export default function ImagemappingArticlesPage() {
  return (
    <Suspense>
      <ArticlesContent mode="imagemapping" />
    </Suspense>
  );
}
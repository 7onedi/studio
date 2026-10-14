'use client';

import { Suspense } from 'react';
import ArticlesContent from '../../components/ArticlesContent';

export default function YouthinsightArticlesPage() {
  return (
    <Suspense>
      <ArticlesContent mode="youthinsight" />
    </Suspense>
  );
}
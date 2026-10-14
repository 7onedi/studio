'use client';

import { Suspense } from 'react';
import ArticlesContent from '../../components/ArticlesContent';

export default function MozaikaArticlesPage() {
  return (
    <Suspense>
      <ArticlesContent mode="mozaika" />
    </Suspense>
  );
}
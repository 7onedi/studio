// src/components/MapLoader.tsx
'use client'; // ОБОВ'ЯЗКОВО: Це робить його Client Component

import dynamic from 'next/dynamic';

// 1. Динамічний імпорт тепер відбувається ТУТ, у Client Component.
const MapComponent = dynamic(() => import('@/app/public/blocks/LeafletMap'), {
  ssr: false, // ТУТ це дозволено, оскільки це Client Component
  loading: () => <p className="text-center p-8">Завантаження карти...</p>,
});

// 2. Експортуємо обгортку, яка просто рендерить динамічно завантажений компонент.
export default function MapLoader() {
  return <MapComponent />;
}
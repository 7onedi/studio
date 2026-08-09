// components/LocationMapLoader.tsx
'use client';

import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('@blocks/LeafletMap/LocationMap'), { ssr: false });

export default LocationMap;
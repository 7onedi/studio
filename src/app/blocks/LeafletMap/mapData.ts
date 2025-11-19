// src/data/mapData.ts

export interface MarkerInfo {
  id: string;
  position: [number, number]; // [lat, lng]
  popupContent: {
    title: string;
    description: string;
    imageUrl: string; // URL до зображення
    linkUrl: string; // Посилання
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Наприклад, іконка з emoji або SVG path
  color: string; // Колір Tailwind CSS
  markers: MarkerInfo[];
}

export const initialCategories: Category[] = [
  {
    id: '#nfk',
    name: '#nfk',
    icon: '/map/Mark1.png',
    color: 'text-red-600',
    markers: [
      {
        id: 'nfk-1',
        position: [49.235, 28.475],
        popupContent: {
          title: 'Локація #nfk 1',
          description: 'Опис першої локації #nfk',
          imageUrl: 'https://picsum.photos/id/10/200/100',
          linkUrl: 'https://example.com/nfk1',
        },
      },
      {
        id: 'nfk-2',
        position: [49.23, 28.46],
        popupContent: {
          title: 'Локація #nfk 2',
          description: 'Опис другої локації #nfk',
          imageUrl: 'https://picsum.photos/id/11/200/100',
          linkUrl: 'https://example.com/nfk2',
        },
      },
    ],
  },
  {
    id: 'youthinsight',
    name: 'Youthinsight фестиваль',
    icon: '/map/Mark2.png',
    color: 'text-pink-600',
    markers: [
      {
        id: 'yi-1',
        position: [48.48, 28.40],
        popupContent: {
          title: 'Локація #nfk 1',
          description: 'Опис першої локації #nfk',
          imageUrl: 'https://picsum.photos/id/10/200/100',
          linkUrl: 'https://example.com/nfk1',
        },
      },
      {
        id: 'yi-2',
        position: [49.22, 28.47],
        popupContent: {
          title: 'Локація #nfk 1',
          description: 'Опис першої локації #nfk',
          imageUrl: 'https://picsum.photos/id/10/200/100',
          linkUrl: 'https://example.com/nfk1',
        },
      },
    ],
  },
  {
    id: 'mozaika',
    name: 'mozaika',
    icon: '/map/Mark3.png',
    color: 'text-purple-600',
    markers: [
      {
        id: 'mozaika-1',
        position: [48.45, 28.42],
        popupContent: {
          title: 'Локація #nfk 1',
          description: 'Опис першої локації #nfk',
          imageUrl: 'https://picsum.photos/id/10/200/100',
          linkUrl: 'https://example.com/nfk1',
        },
      },
      {
        id: 'mozaika-2',
        position: [48.46, 28.44],
        popupContent: {
          title: 'Локація #nfk 2',
          description: 'Опис другої локації #nfk',
          imageUrl: 'https://picsum.photos/id/11/200/100',
          linkUrl: 'https://example.com/nfk2',
        },
      },
    ],
  },
  {
    id: 'movers&shakers',
    name: 'Movers&Shakers',
    icon: '/map/Mark4.png',
    color: 'text-blue-600',
    markers: [
      {
        id: 'ms-1',
        position: [49.250, 28.495],
        popupContent: {
          title: 'Локація #nfk 1',
          description: 'Опис першої локації #nfk',
          imageUrl: 'https://picsum.photos/id/10/200/100',
          linkUrl: 'https://example.com/nfk1',
        },
      },
      {
        id: 'ms-2',
        position: [49.25, 28.48],
        popupContent: {
          title: 'Локація #nfk 2',
          description: 'Опис другої локації #nfk',
          imageUrl: 'https://picsum.photos/id/11/200/100',
          linkUrl: 'https://example.com/nfk2',
        },
      },
    ],
  },
];
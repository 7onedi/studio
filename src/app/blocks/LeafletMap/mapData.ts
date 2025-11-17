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
    icon: '❤️',
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
    icon: '💡',
    color: 'text-pink-600',
    markers: [
      {
        id: 'yi-1',
        position: [49.24, 28.48],
        popupContent: {
          title: 'Сцена Youthinsight',
          description: 'Головна сцена фестивалю.',
          imageUrl: 'https://picsum.photos/id/20/200/100',
          linkUrl: 'https://example.com/youthinsight',
        },
      },
      {
        id: 'yi-2',
        position: [49.22, 28.47],
        popupContent: {
          title: 'Food-корт Youthinsight',
          description: 'Місце, де можна поїсти.',
          imageUrl: 'https://picsum.photos/id/21/200/100',
          linkUrl: 'https://example.com/food',
        },
      },
    ],
  },
  {
    id: 'mozaika',
    name: 'mozaika',
    icon: '🎨',
    color: 'text-purple-600',
    markers: [/* ... 2 маркери ... */],
  },
  {
    id: 'movers&shakers',
    name: 'Movers&Shakers',
    icon: '🕺',
    color: 'text-blue-600',
    markers: [/* ... 2 маркери ... */],
  },
];
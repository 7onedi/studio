'use client';

import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { initialCategories, MarkerInfo, ALL_CATEGORIES_VIEW } from './mapData';
import { useState, useEffect } from 'react';

// Явно визначаємо тип для Map View, щоб уникнути помилки TS 'number[]' vs '[number, number]'
type MapView = {
    center: [number, number];
    zoom: number;
};

// Функція для створення іконки категорії
const createCategoryIcon = (iconUrl: string) =>
  L.icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

// =================================================================
// КОМПОНЕНТ ДЛЯ КЕРУВАННЯ ВИГЛЯДОМ КАРТИ (MapUpdater)
// =================================================================
function MapUpdater({ activeCategory }: { activeCategory: string | null }) {
  const map = useMap(); 
  
  // ЯВНЕ оголошення типу для початкового центру
  const initialMapCenter: [number, number] = [49.23, 28.47];
  const initialZoom = 13;

  useEffect(() => {
    // Ініціалізація з ЯВНО ВКАЗАНИМ ТИПОМ MapView
    let targetView: MapView = { center: initialMapCenter, zoom: initialZoom };

    if (activeCategory === null) {
      // 1. Стан "Показати всі" (використовує ALL_CATEGORIES_VIEW з mapData.ts)
      targetView = ALL_CATEGORIES_VIEW as MapView; // Перетворюємо на MapView
    } else {
      // 2. Стан окремої категорії
      const category = initialCategories.find(cat => cat.id === activeCategory);
      if (category) {
        targetView = { center: category.center, zoom: category.zoom };
      }
    }

    // Застосовуємо нові координати та зум з анімацією
    map.setView(targetView.center, targetView.zoom, { animate: true, duration: 0.7 }); 

  }, [activeCategory, map]); 

  return null;
}
// =================================================================


export default function MapComponent() {
  const [visibleTextFor, setVisibleTextFor] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategories[0]?.id || null
  );
  const [activeMarkers, setActiveMarkers] = useState<MarkerInfo[]>([]);
  const [currentIcon, setCurrentIcon] = useState<L.Icon | null>(null);

  // Фільтруємо маркери + оновлюємо іконку
  useEffect(() => {
    if (activeCategory === null) {
      // Показати всі категорії
      setActiveMarkers(initialCategories.flatMap((cat) => cat.markers));
      setCurrentIcon(null); 
    } else {
      const category = initialCategories.find((cat) => cat.id === activeCategory);

      setActiveMarkers(category ? category.markers : []);

      if (category) setCurrentIcon(createCategoryIcon(category.icon));
    }
  }, [activeCategory]);
  
  // Визначаємо початковий центр та зум на основі першої категорії або дефолтних значень
  const defaultCenter: [number, number] = [49.23, 28.47];
  const defaultZoom: number = 13;

  const initialMapCenter: [number, number] = initialCategories[0]?.center || defaultCenter;
  const initialZoom: number = initialCategories[0]?.zoom || defaultZoom;


  return (
    // Фіксуємо висоту, щоб карта відображалася в межах батьківського контейнера
    <div className="w-full h-[30vh] relative">
      <MapContainer 
        // Використовуємо початкові значення
        center={initialMapCenter} 
        zoom={initialZoom} 
        scrollWheelZoom 
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Компонент, який змінює центр та зум при зміні activeCategory */}
        <MapUpdater activeCategory={activeCategory} />

        {/* Маркери */}
        {activeMarkers.map((marker) => {
          // Логіка визначення іконки
          const category =
            activeCategory === null
              ? initialCategories.find((cat) =>
                  cat.markers.some((m) => m.id === marker.id)
                )
              : null;

          const icon = currentIcon || 
            (category ? createCategoryIcon(category.icon) : undefined);

          return (
            <Marker key={marker.id} position={marker.position} icon={icon}>
              <Popup minWidth={250}>
                <div className="flex flex-col space-y-2 p-2">
                  <h3 className="text-lg font-bold">{marker.popupContent.title}</h3>

                  {/* Використовуємо <img> замість Next/Image, щоб уникнути помилок в ізольованому середовищі */}
                  <img
                    src={marker.popupContent.imageUrl}
                    alt={marker.popupContent.title}
                    className="w-full h-auto rounded-lg object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = `https://placehold.co/200x100/F0F4F8/333333?text=${marker.popupContent.title}`;
                    }}
                  />

                  <p className="text-sm">{marker.popupContent.description}</p>

                  <a
                    href={marker.popupContent.linkUrl}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Перейти за посиланням ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Кнопки категорій */}
      <div className={`absolute top-2 left-2 lg:top-5 lg:left-12 lg:left-0 space-y-2 z-[600] pointer-events-none`}>
        {initialCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              const newState = activeCategory === cat.id ? null : cat.id;
              setActiveCategory(newState);

              // Мобільна логіка
              if (window.innerWidth < 992) {
                if (newState) {
                  setVisibleTextFor(newState);
                  setTimeout(() => {
                    setVisibleTextFor(null);
                  }, 5000);
                } else {
                  setVisibleTextFor(null);
                }
              }
            }}
            className={`pr-4 rounded-full shadow-md transition-all flex items-center space-x-2 pointer-events-auto ${
              activeCategory === cat.id
                ? 'bg-white bg-opacity-90 ring-2 ring-red-600'
                : 'bg-gray-300 bg-opacity-70 hover:bg-opacity-90'
            }`}
          >
            <div className='bg-white rounded-full p-3'>
              <img src={cat.icon} alt={cat.name} width={40} height={40} />
            </div>

            <span className='text-button'>
              {(typeof window !== 'undefined' &&
                (window.innerWidth >= 992 || visibleTextFor === cat.id))
                ? cat.name
                : ''
              }
            </span>
          </button>

        ))}

        {/* Показати всі */}
        <button
          onClick={() => setActiveCategory(null)}
          className={`p-6 rounded-full lg:rounded-2xl shadow-md transition-all pointer-events-auto ${
            activeCategory === null
              ? 'bg-white bg-opacity-90 ring-2 ring-gray-600'
              : 'bg-white bg-opacity-70 hover:bg-opacity-90'
          }`}
        >
          <span className='hidden lg:block'>Показати всі</span>
          <span className='lg:hidden text-button_mobile'>Всі</span>
        </button>
      </div>
    </div>
  );
}
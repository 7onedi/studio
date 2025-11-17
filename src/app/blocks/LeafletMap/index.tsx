// src/components/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { initialCategories, MarkerInfo } from './mapData';
import { useState, useEffect } from 'react';
// ... (імпорт Leaflet та інших частин)

// *** Важливо: Блок для дефолтних іконок залишаємо, щоб вони відображались! ***
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    // Встановлюємо шлях до вашої кастомної іконки
    iconUrl: '/map/Mark.png',
    
    // Якщо ваша іконка має високу роздільну здатність (ретина), 
    // використовуйте той самий файл, або замініть на інший:
    iconRetinaUrl: '/map/Mark.png', 
    
    // Якщо вам не потрібна тінь, можете залишити це поле або вказати прозорий файл
    shadowUrl: undefined, // Можна видалити тінь
    
    // Важливо: Налаштуйте розміри відповідно до вашого Mark.png
    // Приклад для квадратної іконки 32x32:
    iconSize: [32, 32], 
    iconAnchor: [16, 32], // Центрування по нижньому краю
    popupAnchor: [0, -32], // Позиція попапу
  });
}
// *** Кінець блоку для дефолтних іконок

// Головний компонент карти
export default function MapComponent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategories[0]?.id || null);
  const [activeMarkers, setActiveMarkers] = useState<MarkerInfo[]>([]);

  // Логіка фільтрації залишається без змін
  useEffect(() => {
    if (activeCategory === null) {
      setActiveMarkers(initialCategories.flatMap(cat => cat.markers));
    } else {
      const category = initialCategories.find(cat => cat.id === activeCategory);
      setActiveMarkers(category ? category.markers : []);
    }
  }, [activeCategory]);

  const mapCenter: [number, number] = [49.23, 28.47]; // Центр карти (Вінниця)

  return (
    // 1. Батьківський контейнер займає всю доступну висоту і є відносним
    <div className="w-full h-[30vh] relative">
        
      {/* 2. Контейнер карти займає 100% простору */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Маркери активної категорії */}
        {activeMarkers.map(marker => (
            <Marker key={marker.id} position={marker.position}>
              <Popup minWidth={250}>
                {/* Вміст Popup залишається без змін */}
                <div className="flex flex-col space-y-2 p-2">
                    <h3 className="text-lg font-bold">{marker.popupContent.title}</h3>
                    <img
                      src={marker.popupContent.imageUrl}
                      alt={marker.popupContent.title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                    <p className="text-sm">{marker.popupContent.description}</p>
                    <a
                      href={marker.popupContent.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Перейти за посиланням ↗
                    </a>
                  </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* 3. Панель з кнопками: АБСОЛЮТНА позиція справа, поверх карти (z-10) */}
      <div className="absolute top-5 right-5 flex flex-col space-y-2 z-[600] pointer-events-none">
        {initialCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            // pointer-events-auto дозволяє клікати лише на кнопки, ігноруючи батьківський блок
            className={`p-3 rounded-xl shadow-md transition-all duration-200 text-left flex items-center space-x-2 pointer-events-auto ${
              // Стиль кнопки як на скріншоті: світлий фон, тінь, закруглені кути
              activeCategory === cat.id
                ? 'bg-white bg-opacity-90 ring-2 ring-offset-2 ring-blue-600'
                : 'bg-white bg-opacity-70 hover:bg-opacity-90'
            }`}
          >
            <span className={`text-xl ${cat.color}`}>{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </button>
        ))}

        {/* Кнопка "Показати всі" */}
        <button
            onClick={() => setActiveCategory(null)}
            className={`p-3 rounded-xl shadow-md transition-all duration-200 text-left flex items-center space-x-2 pointer-events-auto ${
              activeCategory === null
                ? 'bg-white bg-opacity-90 ring-2 ring-offset-2 ring-gray-600'
                : 'bg-white bg-opacity-70 hover:bg-opacity-90'
            }`}
        >
            <span className="font-medium">Показати всі</span>
        </button>
      </div>
    </div>
  );
}
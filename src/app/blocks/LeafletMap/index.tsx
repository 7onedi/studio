'use client';

import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { initialCategories, MarkerInfo } from './mapData';
import { useState, useEffect } from 'react';

// Функція для створення іконки категорії
const createCategoryIcon = (iconUrl: string) =>
  L.icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

export default function MapComponent() {
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
      setCurrentIcon(null); // Кожний маркер буде мати свою іконку категорії
    } else {
      const category = initialCategories.find((cat) => cat.id === activeCategory);

      setActiveMarkers(category ? category.markers : []);

      if (category) setCurrentIcon(createCategoryIcon(category.icon));
    }
  }, [activeCategory]);

  const mapCenter: [number, number] = [49.23, 28.47];

  return (
    <div className="w-full h-[30vh] relative">
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="leaflet-container">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Маркери */}
        {activeMarkers.map((marker) => {
          // Якщо "Показати всі" → шукаємо іконку категорії
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

                  <img
                    src={marker.popupContent.imageUrl}
                    alt={marker.popupContent.title}
                    className="w-full h-auto rounded-lg object-cover"
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
      <div className="absolute top-5 right-5 flex flex-col space-y-2 z-[600] pointer-events-none">
        {initialCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`p-3 rounded-xl shadow-md transition-all flex items-center space-x-2 pointer-events-auto ${
              activeCategory === cat.id
                ? 'bg-white bg-opacity-90 ring-2 ring-blue-600'
                : 'bg-white bg-opacity-70 hover:bg-opacity-90'
            }`}
          >
            <Image src={cat.icon} alt={cat.name} width={40} height={40} />
            <span>{cat.name}</span>
          </button>
        ))}

        {/* Показати всі */}
        <button
          onClick={() => setActiveCategory(null)}
          className={`p-3 rounded-xl shadow-md transition-all pointer-events-auto ${
            activeCategory === null
              ? 'bg-white bg-opacity-90 ring-2 ring-gray-600'
              : 'bg-white bg-opacity-70 hover:bg-opacity-90'
          }`}
        >
          Показати всі
        </button>
      </div>
    </div>
  );
}

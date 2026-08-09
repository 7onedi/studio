'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from "@/app/providers/LanguageProvider";

const MARKER_ICONS: Record<string, string> = {
  IMAGEMAPPING: '/map/Imagemapping.png',
  HISTORICAL: '/map/Historical.png',
  NATURE: '/map/Nature.png',
};

function createMarkerIcon(type: string) {
  return L.icon({
    iconUrl: MARKER_ICONS[type] ?? MARKER_ICONS.IMAGEMAPPING,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });
}

function extractPreviewText(blocks: any[] | undefined): string | null {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  const paragraphs = blocks.filter((b: any) => b.type === 'paragraph');
  if (!paragraphs.length) return null;
  return paragraphs.map((b: any) => (b.data?.text ?? '').replace(/<[^>]*>/g, '')).join(' ') || null;
}

function pickLocalized<T>(
  locale: string,
  byLocale: Record<string, T[] | undefined>,
  fallback: T[] | undefined
): T[] | undefined {
  const key = locale.toLowerCase();
  const value = byLocale[key];
  return (Array.isArray(value) && value.length > 0) ? value : fallback;
}

function pickLocalizedText(locale: string, byLocale: Record<string, string | undefined>, fallback: string | undefined): string | undefined {
  const key = locale.toLowerCase();
  return byLocale[key] || fallback;
}

export interface LocationMarker {
  id: number;
  title: string;
  title_en?: string | null;
  title_pl?: string | null;
  title_lt?: string | null;
  title_ro?: string | null;
  body?: any[];
  body_en?: any[];
  body_pl?: any[];
  body_lt?: any[];
  body_ro?: any[];
  markerType: string;
  imageUrl?: string;
  websiteUrl?: string | null;
  lat: number;
  lng: number;
}

interface Props {
  centerLat: number;
  centerLng: number;
  zoom: number;
  markers: LocationMarker[];
}

export default function LocationMap({ centerLat, centerLng, zoom, markers }: Props) {
  const { locale } = useLanguage();

  return (
    <div className="w-full h-[40vh] lg:h-[50vh] rounded-2xl overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom
        className="leaflet-container"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => {
          const titleByLocale: Record<string, string | undefined> = {
            uk: marker.title,
            pl: marker.title_pl ?? undefined,
            lt: marker.title_lt ?? undefined,
            ro: marker.title_ro ?? undefined,
            en: marker.title_en ?? undefined,
          };
          const bodyByLocale: Record<string, any[] | undefined> = {
            uk: marker.body,
            pl: marker.body_pl,
            lt: marker.body_lt,
            ro: marker.body_ro,
            en: marker.body_en,
          };
          const title = pickLocalizedText(locale, titleByLocale, marker.title_en ?? undefined) ?? marker.title;
          const bodyBlocks = pickLocalized(locale, bodyByLocale, marker.body_en);
          const previewText = extractPreviewText(bodyBlocks);

          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createMarkerIcon(marker.markerType)}
            >
              <Popup minWidth={220}>
                <div className="flex flex-col space-y-2 p-2">
                  {marker.imageUrl && (
                    <img
                      src={marker.imageUrl}
                      alt={title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  )}
                  <h3 className="text-base font-bold">{title}</h3>
                  {previewText && (
                    <p className={`text-sm ${marker.websiteUrl ? 'line-clamp-3 overflow-hidden' : ''}`}>
                        {previewText}
                    </p>
                    )}
                    {marker.websiteUrl && (
                      <a
                        href={marker.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Read more ↗
                    </a>
                    )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
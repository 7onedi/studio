export type MarkerInfo = {
  id: string;
  position: [number, number];
  popupContent: {
    slug: string;
    title: string;
    Logo: string;
    description: string | any;
    imageUrl: string;
    linkUrl?: string;
    gradient: string;
    zoom: boolean;
    iconNames: { title: string; link: string }[];
  };
};

export type MapCategory = {
  id: string;
  name: string;
  icon: string;
  center: [number, number];
  zoom: number;
  markers: MarkerInfo[];
};
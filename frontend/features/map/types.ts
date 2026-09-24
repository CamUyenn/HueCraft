export interface NavigationLink {
  targetId: string;
  label: string;
  direction: 'forward' | 'backward' | 'left' | 'right';
  yaw: number;     // horizontal angle in degrees (0 - 360)
  pitch: number;   // vertical angle in degrees (-90 to 90)
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  yaw: number;
  pitch: number;
  category?: 'craft' | 'culture' | 'scenic' | 'info';
  icon?: string;
  image?: string;
  villageId?: string;
}

export interface StreetViewNode {
  id: string;
  title: string;
  subtitle: string;
  address: string;
  image: string;
  thumbnail: string;
  mapCoords: {
    x: number; // percentage on map (0-100)
    y: number; // percentage on map (0-100)
  };
  initialYaw: number;
  initialPitch: number;
  links: NavigationLink[];
  hotspots: Hotspot[];
}

// Single source of truth for the pitch. Prices and counts are placeholders:
// confirm with the cafe before showing.

export type Station = {
  id: "ps5" | "ps4" | "pc" | "snooker" | "sim" | "vr";
  name: string;
  tagline: string;
  count: number;
  pricePerHour: number;
  unit: string; // what one booking reserves
};

export const STATIONS: Station[] = [
  { id: "ps5", name: "PlayStation 5", tagline: "FC 25, GTA V, Tekken 8, Spider-Man 2 on 4K screens", count: 4, pricePerHour: 80, unit: "console" },
  { id: "pc", name: "Gaming PC", tagline: "High-refresh rigs for Valorant, CS2, BGMI-on-PC and more", count: 8, pricePerHour: 70, unit: "PC" },
  { id: "ps4", name: "PlayStation 4", tagline: "The classics, couch co-op and FIFA nights", count: 3, pricePerHour: 60, unit: "console" },
  { id: "snooker", name: "Snooker", tagline: "Full-size table, cues and chalk on the house", count: 2, pricePerHour: 200, unit: "table" },
  { id: "sim", name: "Racing Sim", tagline: "Wheel, pedals and bucket seat. Feel every corner", count: 1, pricePerHour: 150, unit: "rig" },
  { id: "vr", name: "VR Zone", tagline: "Step inside the game with full-motion VR", count: 1, pricePerHour: 150, unit: "headset" },
];

export const OPEN_HOUR = 10; // 10 AM
export const CLOSE_HOUR = 23; // 11 PM, last slot starts 10 PM

export const CAFE = {
  name: "Infinity Gaming",
  area: "MP Nagar, Bhopal",
  phone: "+91 00000 00000", // placeholder
  mapsLink:
    "https://www.google.com/maps/place/Infinity+gaming/@23.2330143,77.4363623,17z",
  mapsEmbed: "https://maps.google.com/maps?q=23.2330143,77.4363623&z=17&output=embed",
};

export const hourLabel = (h: number) =>
  `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

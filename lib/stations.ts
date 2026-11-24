// Single source of truth for the pitch. Prices and counts are placeholders:
// confirm with the cafe before showing.

export type Station = {
  id: "ps5" | "ps4" | "xbox" | "pc" | "snooker" | "sim" | "vr";
  name: string;
  tagline: string;
  count: number;
  pricePerHour: number;
  unit: string; // what one booking reserves
};

export const STATIONS: Station[] = [
  { id: "ps5", name: "PlayStation 5", tagline: "FC 25, GTA V, Tekken 8, Spider-Man 2 on 4K screens", count: 4, pricePerHour: 80, unit: "console" },
  { id: "xbox", name: "Xbox Series X", tagline: "Forza, Halo and the whole Game Pass library in 4K", count: 2, pricePerHour: 80, unit: "console" },
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

// Covers live in /public/games. `bg` + "contain" for logo-only art.
export type Game = { title: string; img: string; on: string; bg?: string };

export const GAMES: Game[] = [
  { title: "GTA VI", img: "gta6.png", on: "PS5 · New" },
  { title: "GTA V", img: "gta5.jpg", on: "PS5 · PC" },
  { title: "Red Dead Redemption 2", img: "rdr2.jpg", on: "PS5" },
  { title: "007 First Light", img: "007.jpg", on: "PS5 · New" },
  { title: "Hogwarts Legacy", img: "hogwarts.jpg", on: "PS5" },
  { title: "Marvel's Spider-Man 2", img: "spiderman2.jpg", on: "PS5" },
  { title: "Valorant", img: "valorant.png", on: "PC", bg: "#0f1923" },
  { title: "Counter-Strike 2", img: "cs2.jpg", on: "PC" },
  { title: "EA FC 26", img: "fc26.png", on: "PS5" },
  { title: "God of War Ragnarök", img: "gow.jpg", on: "PS5" },
  { title: "Call of Duty: Black Ops 7", img: "bo7.png", on: "PS5 · PC" },
  { title: "Tekken 8", img: "tekken8.jpg", on: "PS5" },
  { title: "Ghost of Tsushima", img: "ghost.jpg", on: "PS5" },
  { title: "Forza Horizon 5", img: "forza5.jpg", on: "Racing Sim" },
  { title: "Black Myth: Wukong", img: "wukong.jpg", on: "PC" },
  { title: "PUBG: Battlegrounds", img: "pubg.jpg", on: "PC" },
  { title: "Elden Ring", img: "eldenring.jpg", on: "PS5" },
  { title: "Cyberpunk 2077", img: "cyberpunk.jpg", on: "PC" },
  { title: "Mortal Kombat 1", img: "mk1.jpg", on: "PS5" },
  { title: "Assassin's Creed Shadows", img: "acshadows.jpg", on: "PS5" },
];

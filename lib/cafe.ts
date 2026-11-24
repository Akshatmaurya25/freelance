// Everything that changes per client lives here. New client branch:
//   1. Add their logo as components/logos/<Name>.tsx (SVG, or an <img> of /public/brand/*)
//   2. Edit CAFE below
//   3. Swap app/favicon.ico
// Stations, prices and games are in lib/stations.ts; photos in /public/cafe.
import { MinusOneLogo } from "@/components/logos/MinusOne";

export const CAFE = {
  name: "Minus One Gaming", // last word renders muted in the header
  area: "MP Nagar Zone 2, Bhopal", // short, used in page title and footer
  address: "No. 175, near Sargam Cinema, MP Nagar Zone 2, Bhopal", // full, shown under "Find us"
  phone: "+91 00000 00000", // placeholder
  open: 12, // 24h; 12 PM
  close: 24, // midnight, last slot starts 11 PM
  mapsLink:
    "https://www.google.com/maps/place/Minus+One+Gaming+Zone+and+Cafe/@23.2285443,77.4357129,17z/data=!4m6!3m5!1s0x397c43a476f1bdb5:0x9af8d87d8c8ac13!8m2!3d23.2285443!4d77.4357129!16s%2Fg%2F11td926s2n",
  // q=<lat>,<lng> from the !3d…!4d… pin in mapsLink (the @ part is just the viewport)
  mapsEmbed: "https://maps.google.com/maps?q=23.2285443,77.4357129&z=17&output=embed",
  Logo: MinusOneLogo,
};

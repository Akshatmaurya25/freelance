import Image from "next/image";

// Real photos of the cafe, /public/cafe. Spans are tuned so the 4-column grid packs to 6 full rows.
const PHOTOS = [
  { src: "crowd", caption: "Weekend nights at the snooker table", span: "col-span-2 row-span-2" },
  { src: "pc-arena", caption: "The PC arena", span: "row-span-2" },
  { src: "couch-coop", caption: "Couch co-op on the big screen", span: "row-span-2" },
  { src: "snooker-lounge", caption: "Snooker under the lamps", span: "col-span-2" },
  { src: "mocktail", caption: "Mocktails between frames", span: "row-span-2" },
  { src: "console-lounge", caption: "FC nights in the console lounge", span: "row-span-2" },
  { src: "tables", caption: "Two full-size tables", span: "col-span-2" },
  { src: "snooker-table", caption: "Tournament-grade tables", span: "row-span-2" },
  { src: "big-screen", caption: "Every station on a big screen", span: "col-span-2" },
  { src: "red-room", caption: "The red room", span: "row-span-2" },
  { src: "pool-night", caption: "Late-night frames", span: "col-span-2" },
];

// reveal: scroll-triggered fly-ins (home page, driven by HomeFx). Otherwise tiles stagger in on load.
export default function Gallery({ reveal = false }: { reveal?: boolean }) {
  return (
    <ul className="grid grid-flow-dense auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-4">
      {PHOTOS.map((p, i) => (
        <li
          key={p.src}
          data-reveal={reveal ? ["left", "up", "right"][i % 3] : undefined}
          className={`${p.span} ${reveal ? "" : "tile-in"}`}
          style={reveal ? undefined : { animationDelay: `${0.5 + i * 0.07}s` }}
        >
          <figure className="group relative size-full overflow-hidden rounded-2xl bg-panel ring-1 ring-white/10 transition duration-500 hover:ring-accent/60 hover:shadow-[0_0_50px_-12px_rgb(239_35_60/.7)]">
            <Image
              src={`/cafe/${p.src}.webp`}
              alt={p.caption}
              fill
              sizes={p.span.includes("col-span-2") ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className="object-cover transition duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-70 transition duration-500 group-hover:opacity-100" />
            <figcaption className="absolute inset-x-3 bottom-3 text-xs font-semibold transition duration-500 sm:text-sm md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {p.caption}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

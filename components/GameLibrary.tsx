"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GAMES } from "@/lib/stations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function GameLibrary() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the section and let vertical scroll drive a 3D coverflow.
      // Elsewhere the row stays a native swipe/scroll strip.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const view = root.current!.querySelector<HTMLElement>("[data-view]")!;
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-game]");
        gsap.set(view, { overflow: "visible" });

        let centers: number[] = [];
        // offsetLeft is relative to the full-width section and ignores the track's transform
        const measure = () => (centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2));
        const flow = () => {
          const x = Number(gsap.getProperty(track, "x"));
          cards.forEach((c, i) => {
            const d = (centers[i] + x - innerWidth / 2) / innerWidth; // ~ -1..1, 0 = centre
            const a = Math.min(Math.abs(d), 1);
            gsap.set(c, {
              rotationY: gsap.utils.clamp(-55, 55, -d * 120),
              z: -a * 420,
              scale: 1.12 - a * 0.25,
              opacity: 1 - a * 0.55,
            });
          });
        };
        const dist = () => track.scrollWidth - innerWidth;

        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          onUpdate: flow,
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + dist(),
            invalidateOnRefresh: true,
            onRefresh: () => (measure(), flow()),
          },
        });
        measure();
        flow();
      });
    },
    { scope: root },
  );

  return (
    <section id="games" ref={root} className="relative scroll-mt-16 overflow-hidden border-t border-line md:flex md:h-dvh md:flex-col md:justify-center">
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 md:pt-0">
        <p data-reveal="left" className="text-sm font-medium tracking-widest text-accent uppercase">
          Game library
        </p>
        <h2 data-reveal="left" className="mt-2 font-display text-3xl font-bold sm:text-5xl">
          {GAMES.length}+ titles, ready to play
        </h2>
        <p data-reveal="right" className="mt-3 text-muted">
          The biggest releases on PS5 and high-refresh PCs. <span className="hidden md:inline">Keep scrolling.</span>
          <span className="md:hidden">Swipe to browse.</span>
        </p>
      </div>
      <div data-view className="mt-10 overflow-x-auto pb-20 [perspective:1400px] [scrollbar-width:none] md:pb-0">
        <ul
          data-track
          className="flex w-max snap-x snap-mandatory gap-5 px-4 [transform-style:preserve-3d] md:gap-8 md:px-[calc(50vw-115px)]"
        >
          {GAMES.map((g) => (
            <li key={g.title} data-game className="w-[180px] shrink-0 snap-center [transform-style:preserve-3d] md:w-[230px]">
              <div
                data-tilt
                className="glare relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_30px_60px_-20px_rgb(0_0_0/.9)] md:[-webkit-box-reflect:below_12px_linear-gradient(transparent_78%,rgb(0_0_0/.28))]"
                style={g.bg ? { background: g.bg } : undefined}
              >
                <Image
                  src={`/games/${g.img}`}
                  alt={g.title}
                  fill
                  sizes="230px"
                  className={g.bg ? "object-contain p-6 pb-16" : "object-cover"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur">
                  {g.on}
                </span>
                <p className="absolute inset-x-3 bottom-3 font-display text-lg leading-tight font-bold">{g.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

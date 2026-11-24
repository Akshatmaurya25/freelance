"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STATIONS } from "@/lib/stations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Table is 400x220 SVG units; felt playing area 20..380 x 20..200, ball radius 7.
const R = 7;
const POCKETS = [[22, 22], [200, 17], [378, 22], [22, 198], [200, 203], [378, 198]];
const REDS = Array.from({ length: 5 }, (_, k) =>
  Array.from({ length: k + 1 }, (_, j) => ({ x: 282 + k * 13, y: 110 + (j - k / 2) * 14.5, fill: "#d3112b", hit: true })),
).flat();
const BALLS = [
  ...REDS,
  { x: 352, y: 110, fill: "#111", hit: true },
  { x: 200, y: 110, fill: "#1f5fd1", hit: false },
  { x: 100, y: 110, fill: "#7a4a22", hit: false },
  { x: 100, y: 82, fill: "#1f9a4a", hit: false },
  { x: 100, y: 138, fill: "#f2c81f", hit: false },
];
const CUE = { x: 70, y: 150 };
const APEX = REDS[0];
const DIR = (() => {
  const dx = APEX.x - CUE.x, dy = APEX.y - CUE.y, l = Math.hypot(dx, dy);
  return { x: dx / l, y: dy / l };
})();
const CONTACT = { x: APEX.x - DIR.x * R * 2, y: APEX.y - DIR.y * R * 2 };
const ANGLE = (Math.atan2(DIR.y, DIR.x) * 180) / Math.PI;

// fold a coordinate back inside [lo, hi], i.e. bounce off the cushions
const bounce = (v: number, lo: number, hi: number) => {
  const span = hi - lo;
  const t = (((v - lo) % (2 * span)) + 2 * span) % (2 * span);
  return lo + (t > span ? 2 * span - t : t);
};

const snooker = STATIONS.find((s) => s.id === "snooker")!;

export default function Snooker() {
  const root = useRef<HTMLElement>(null);
  const play = useRef(() => {});

  useGSAP(
    () => {
      const balls = gsap.utils.toArray<SVGGElement>("[data-ball]", root.current);
      let t: gsap.core.Timeline | undefined;

      const reset = () => {
        t?.kill();
        balls.forEach((b, i) =>
          gsap.set(b, { x: BALLS[i].x, y: BALLS[i].y, scale: 1, opacity: 1, transformOrigin: "50% 50%" }),
        );
        gsap.set("[data-cueball]", { x: CUE.x, y: CUE.y });
        gsap.set("[data-stick]", { x: -40, opacity: 1 });
        gsap.set("[data-flash]", { attr: { r: 0 }, opacity: 0 });
      };

      // Runs from clicks too, outside the gsap context, so the timeline is killed manually on unmount.
      play.current = () => {
        reset();
        const tl = (t = gsap.timeline());
        tl.to("[data-stick]", { x: -70, duration: 0.6, ease: "power2.inOut" })
          .to("[data-stick]", { x: 4, duration: 0.14, ease: "power3.in" })
          .to("[data-cueball]", { x: CONTACT.x, y: CONTACT.y, duration: 0.32, ease: "none" }, "<0.12")
          .to("[data-stick]", { x: -50, opacity: 0, duration: 0.6, ease: "power2.out" }, "<")
          .addLabel("hit")
          .fromTo("[data-flash]", { attr: { r: 2 }, opacity: 0.9 }, { attr: { r: 60 }, opacity: 0, duration: 0.6, ease: "expo.out" }, "hit")
          .fromTo("[data-felt]", { x: -3 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }, "hit")
          .to("[data-cueball]", { x: 190, y: 172, duration: 1.6, ease: "power3.out" }, "hit");

        const pocketed = gsap.utils.shuffle(REDS.map((_, i) => i)).slice(0, 3);
        BALLS.forEach((b, i) => {
          if (!b.hit) return;
          const dx = b.x - CONTACT.x, dy = b.y - CONTACT.y, d = Math.hypot(dx, dy) || 1;
          const delay = d / 900;
          if (pocketed.includes(i)) {
            const [px, py] = POCKETS.reduce((a, p) => (Math.hypot(p[0] - b.x, p[1] - b.y) < Math.hypot(a[0] - b.x, a[1] - b.y) ? p : a));
            tl.to(balls[i], { x: px, y: py, duration: 0.9 + Math.random() * 0.5, ease: "power1.in" }, `hit+=${delay}`)
              .to(balls[i], { scale: 0, opacity: 0, duration: 0.2 }, ">-0.05");
            return;
          }
          const power = gsap.utils.random(60, 260) * (1 - Math.min(d, 90) / 180);
          const spread = gsap.utils.random(-0.5, 0.5);
          const ux = dx / d + spread * -dy / d, uy = dy / d + spread * dx / d;
          tl.to(balls[i], {
            x: bounce(b.x + ux * power, 20 + R, 380 - R),
            y: bounce(b.y + uy * power, 20 + R, 200 - R),
            duration: gsap.utils.random(1.4, 2.4),
            ease: "power3.out",
          }, `hit+=${delay}`);
        });
      };

      reset();
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({ trigger: "[data-table]", start: "top 65%", once: true, onEnter: () => play.current() });
      });
      return () => t?.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p data-reveal="left" className="text-sm font-medium tracking-widest text-accent uppercase">
            Not just consoles
          </p>
          <h2 data-reveal="left" className="mt-2 font-display text-3xl font-bold sm:text-5xl">
            Full-size snooker, right next door.
          </h2>
          <p data-reveal="left" className="mt-4 max-w-md text-muted">
            {snooker.count} tournament tables with cues and chalk on the house. Take a break from the
            screen, or settle the score the old-school way.
          </p>
          <div data-reveal="left" className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/book?station=snooker"
              data-magnetic
              className="rounded-md bg-accent px-6 py-3 font-semibold text-on-accent transition hover:brightness-110"
            >
              Book a table · ₹{snooker.pricePerHour}/hr
            </Link>
            <button
              onClick={() => play.current()}
              className="rounded-md border border-line px-5 py-3 text-sm font-semibold transition hover:border-muted"
            >
              ↻ Break again
            </button>
          </div>
        </div>

        <div data-reveal="right" className="[perspective:1400px]">
          <div data-tilt data-table className="cursor-pointer" onClick={() => play.current()} title="Click to break">
            <svg
              viewBox="0 0 400 220"
              role="img"
              aria-label="Snooker table: click to break the rack"
              className="w-full drop-shadow-[0_50px_40px_rgb(0_0_0/.7)] [transform:rotateX(24deg)]"
            >
              <defs>
                <radialGradient id="felt" cx="50%" cy="45%" r="70%">
                  <stop offset="0" stopColor="#13894a" />
                  <stop offset="1" stopColor="#06492a" />
                </radialGradient>
                <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6b3a1c" />
                  <stop offset="1" stopColor="#3a1d0c" />
                </linearGradient>
                <radialGradient id="shine" cx="35%" cy="30%" r="65%">
                  <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                  <stop offset=".35" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="220" rx="16" fill="url(#wood)" />
              <g data-felt>
                <rect x="16" y="16" width="368" height="188" rx="6" fill="url(#felt)" />
                <rect x="20" y="20" width="360" height="180" fill="none" stroke="#0a5c33" strokeWidth="3" />
                <line x1="100" y1="20" x2="100" y2="200" stroke="#ffffff40" />
                <path d="M100 80 A30 30 0 0 0 100 140" fill="none" stroke="#ffffff40" />
                {[60, 140, 260, 340].flatMap((x) => [
                  <circle key={`t${x}`} cx={x} cy="9" r="1.8" fill="#e8d6a8" />,
                  <circle key={`b${x}`} cx={x} cy="211" r="1.8" fill="#e8d6a8" />,
                ])}
                {POCKETS.map(([x, y]) => (
                  <circle key={`${x}${y}`} cx={x} cy={y} r="10" fill="#050505" stroke="#1a1a1a" strokeWidth="2" />
                ))}
                <circle data-flash cx={CONTACT.x} cy={CONTACT.y} r="0" fill="none" stroke="#fff" strokeWidth="2" />
                {BALLS.map((b, i) => (
                  <g key={i} data-ball>
                    <circle r={R} fill={b.fill} />
                    <circle r={R} fill="url(#shine)" />
                  </g>
                ))}
                <g data-cueball>
                  <circle r={R} fill="#f4f1e8" />
                  <circle r={R} fill="url(#shine)" />
                </g>
                <g transform={`translate(${CUE.x} ${CUE.y}) rotate(${ANGLE})`}>
                  <g data-stick>
                    <rect x="-230" y="-3" width="220" height="6" rx="3" fill="#c79a5b" />
                    <rect x="-230" y="-3.5" width="80" height="7" rx="3" fill="#2a1408" />
                    <rect x="-14" y="-2.5" width="4" height="5" rx="1" fill="#3d7bd8" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <p className="mt-4 text-center text-xs text-muted">Click the table to break</p>
        </div>
      </div>
    </section>
  );
}

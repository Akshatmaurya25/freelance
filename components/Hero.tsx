"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { GAMES, STATIONS } from "@/lib/stations";
import { CAFE } from "@/lib/cafe";

gsap.registerPlugin(useGSAP, SplitText);

const STACK = ["Red Dead Redemption 2", "GTA VI", "007 First Light"].map((t) => GAMES.find((g) => g.title === t)!);
// fanned positions for the 3D cover stack, middle card in front
const POS = [
  { x: -130, z: -140, rotationY: 32 },
  { x: 0, z: 40, rotationY: 0 },
  { x: 130, z: -140, rotationY: -32 },
];

const STATS: [number, string, string, string][] = [
  [STATIONS.reduce((n, s) => n + s.count, 0), "", "+", "Stations"],
  [GAMES.length, "", "+", "Top titles"],
  [Math.min(...STATIONS.map((s) => s.pricePerHour)), "₹", "", "From / hr"],
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((c, i) => gsap.set(c, POS[i]));

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.3 } });

        gsap.utils.toArray<HTMLElement>("[data-hero]:not([data-card])").forEach((el, i) => {
          const side = el.dataset.from === "left" ? -1 : el.dataset.from === "right" ? 1 : 0;
          tl.fromTo(
            el,
            { autoAlpha: 0, x: side * 160, y: side ? 0 : 50, rotationY: side * -40, filter: "blur(12px)", transformPerspective: 900 },
            { autoAlpha: 1, x: 0, y: 0, rotationY: 0, filter: "blur(0px)" },
            i * 0.12,
          );
        });

        const split = SplitText.create(root.current!.querySelector(".split")!, { type: "chars" });
        tl.from(split.chars, { yPercent: 110, rotationX: -90, opacity: 0, stagger: 0.05, duration: 0.9, ease: "back.out(2.5)" }, 0.45);

        cards.forEach((c, i) =>
          tl.fromTo(
            c,
            { autoAlpha: 0, x: 700, z: -500, rotationY: -110 },
            { autoAlpha: 1, ...POS[i], duration: 1.8 },
            0.35 + i * 0.15,
          ),
        );
        cards.forEach((c, i) =>
          gsap.to(c, { y: i === 1 ? -18 : 14, duration: 2.6 + i * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 }),
        );

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const o = { v: 0 };
          tl.to(o, {
            v: Number(el.dataset.count),
            duration: 2,
            ease: "power2.out",
            onUpdate: () => (el.textContent = `${el.dataset.pre}${Math.round(o.v)}${el.dataset.suf}`),
          }, 0.9);
        });

        // stack follows the mouse
        const stack = root.current!.querySelector("[data-stack]");
        const rx = gsap.quickTo(stack, "rotationX", { duration: 0.9, ease: "power3" });
        const ry = gsap.quickTo(stack, "rotationY", { duration: 0.9, ease: "power3" });
        const move = (e: PointerEvent) => {
          ry((e.clientX / innerWidth - 0.5) * 30);
          rx(-(e.clientY / innerHeight - 0.5) * 18);
        };
        addEventListener("pointermove", move);
        return () => {
          removeEventListener("pointermove", move);
          split.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="orb -top-1/4 -left-1/4 bg-accent/25" />
        <div className="orb top-1/4 -right-1/4 bg-accent-2/15 [animation-delay:-7s]" />
        <div className="grid-floor" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:pb-28">
        <div>
          <h1 className="font-display text-5xl leading-[1.02] font-bold sm:text-7xl">
            <span data-hero data-from="left" className="block">
              Every game.
            </span>
            <span data-hero data-from="right" className="block">
              One{" "}
              <span className="split inline-block text-accent [text-shadow:0_0_32px_rgb(239_35_60/.65)]">
                infinite
              </span>{" "}
              arena.
            </span>
          </h1>
          <p data-hero data-from="left" className="mt-6 max-w-xl text-lg text-muted">
            PS5, Xbox, PS4, high-refresh gaming PCs, snooker, a racing sim and VR, all under one roof. Pick
            your station, pick your time, show up and play.
          </p>
          <div data-hero className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/book"
              data-magnetic
              className="rounded-md bg-accent px-7 py-3.5 font-semibold text-on-accent shadow-[0_0_40px_-6px_rgb(239_35_60/.8)] transition hover:brightness-110"
            >
              Book your slot
            </Link>
            <a
              href="#games"
              data-magnetic
              className="rounded-md border border-line bg-bg/40 px-7 py-3.5 font-semibold backdrop-blur transition hover:border-muted"
            >
              See the games
            </a>
          </div>
          <dl data-hero className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
            {STATS.map(([n, pre, suf, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-bold tabular-nums" data-count={n} data-pre={pre} data-suf={suf}>
                  {pre + n + suf}
                </dd>
                <dd className="text-sm text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-md [perspective:1200px] sm:h-[440px]">
          <CAFE.Logo className="absolute inset-x-0 top-1/2 mx-auto w-4/5 -translate-y-1/2 opacity-25 blur-[2px]" />
          <div data-stack className="absolute inset-0 [transform-style:preserve-3d]">
            {STACK.map((g, i) => (
              <div
                key={g.title}
                data-hero
                data-card
                className="absolute top-1/2 left-1/2 -mt-[135px] -ml-[95px] h-[270px] w-[190px] overflow-hidden rounded-2xl border border-white/15 shadow-[0_40px_80px_-20px_rgb(0_0_0/.9),0_0_60px_-20px_rgb(239_35_60/.6)] sm:-mt-[160px] sm:-ml-[112px] sm:h-[320px] sm:w-[224px]"
              >
                <Image src={`/games/${g.img}`} alt={g.title} fill sizes="224px" loading="eager" fetchPriority={i === 1 ? "high" : "auto"} className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

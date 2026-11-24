"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Page-wide motion for the home page. Render it LAST so the pinned game section
// already exists when the reveal triggers below measure their positions.
//   data-reveal="left|right|up"  fly in on scroll
//   data-tilt                    3D tilt + glare toward the pointer
//   data-magnetic                drifts toward the pointer
export default function HomeFx() {
  const bar = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ anchors: { offset: -64 } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const side = el.dataset.reveal === "left" ? -1 : el.dataset.reveal === "right" ? 1 : 0;
        gsap.from(el, {
          x: side * 180,
          y: side ? 0 : 70,
          rotationY: side * -30,
          opacity: 0,
          transformPerspective: 1000,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      return () => {
        lenis.destroy();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
      };
    });

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const off: (() => void)[] = [];
      const on = (el: EventTarget, type: string, fn: (e: PointerEvent) => void) => {
        el.addEventListener(type, fn as EventListener);
        off.push(() => el.removeEventListener(type, fn as EventListener));
      };

      const gx = gsap.quickTo(glow.current, "x", { duration: 0.7, ease: "power3" });
      const gy = gsap.quickTo(glow.current, "y", { duration: 0.7, ease: "power3" });
      gsap.set(glow.current, { opacity: 1 });
      on(window, "pointermove", (e) => (gx(e.clientX), gy(e.clientY)));

      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
        on(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 18);
          rx((0.5 - py) * 18);
          el.style.setProperty("--gx", px * 100 + "%");
          el.style.setProperty("--gy", py * 100 + "%");
        });
        on(el, "pointerleave", () => (rx(0), ry(0)));
      });

      gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        on(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.35);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        });
        on(el, "pointerleave", () => (x(0), y(0)));
      });

      return () => off.forEach((f) => f());
    });

    ScrollTrigger.refresh();
  });

  return (
    <>
      <div
        ref={bar}
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2"
      />
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-10 -mt-[250px] -ml-[250px] size-[500px] rounded-full bg-accent/10 opacity-0 mix-blend-screen blur-3xl"
      />
    </>
  );
}

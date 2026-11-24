import Image from "next/image";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { CAFE, STATIONS, hourLabel, type Station } from "@/lib/stations";

export type Booking = {
  id: string;
  station: Station["id"];
  date: string; // YYYY-MM-DD
  start: number;
  end: number; // inclusive start hour of the last slot
  name: string;
  phone: string;
  total: number;
};

// ponytail: QR look-alike seeded by the booking ID, not scannable. Swap for a real
// encoder (e.g. uqr) once bookings live on a backend the desk can look up.
function FakeQR({ seed }: { seed: string }) {
  const N = 25;
  let h = 1;
  for (const c of seed) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  const finder = (x: number, y: number) => (x < 8 || x >= N - 8) && y < 8 || (x < 8 && y >= N - 8);
  let d = "";
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h >>>= 0; // xorshift
      if (!finder(x, y) && h & 1) d += `M${x} ${y}h1v1h-1z`;
    }
  return (
    <svg viewBox="0 0 25 25" shapeRendering="crispEdges" role="img" aria-label={`Entry pass for booking ${seed}`} className="size-full">
      <path d={d} fill="#08080b" />
      {[[0, 0], [N - 7, 0], [0, N - 7]].map(([x, y]) => (
        <g key={`${x}${y}`} fill="#08080b">
          <path d={`M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z`} fillRule="evenodd" />
          <rect x={x + 2} y={y + 2} width="3" height="3" />
        </g>
      ))}
    </svg>
  );
}

// Deterministic burst: golden-angle spread, so no Math.random during render.
const CONFETTI = Array.from({ length: 36 }, (_, i) => {
  const a = i * 2.39996;
  const r = 140 + ((i * 53) % 220);
  return {
    "--x": `${Math.round(Math.cos(a) * r)}px`,
    "--y": `${Math.round(Math.sin(a) * r * 0.6 - 120)}px`,
    "--r": `${(i * 97) % 720 - 360}deg`,
    background: ["#ef233c", "#ff8a3d", "#f1f1f4", "#ff5a6a"][i % 4],
    animationDelay: `${0.25 + (i % 6) * 0.03}s`,
    width: i % 3 ? 8 : 5,
    height: i % 3 ? 4 : 10,
  } as React.CSSProperties;
});

export default function Confirmed({ booking: b, onAgain }: { booking: Booking; onAgain: () => void }) {
  const s = STATIONS.find((x) => x.id === b.station)!;
  const hours = b.end - b.start + 1;
  const date = new Date(b.date + "T00:00");

  return (
    <>
      <section className="relative overflow-hidden pb-20">
        {/* real cafe photo behind the pass */}
        <Image src="/cafe/crowd.webp" alt="" fill loading="eager" sizes="100vw" className="scale-110 object-cover opacity-30 blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg" />
        <div className="orb -top-1/3 left-1/4 bg-accent/25" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-4 pt-14 text-center sm:pt-20">
          <div className="relative mx-auto size-20">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 [animation-iteration-count:2]" />
            <svg viewBox="0 0 80 80" className="relative size-full drop-shadow-[0_0_24px_rgb(239_35_60/.8)]" aria-hidden>
              <circle cx="40" cy="40" r="36" fill="var(--color-accent)" className="pop-in" />
              <path pathLength={1} d="M24 41l11 11 22-24" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="draw [animation-delay:.35s]" />
            </svg>
            <div className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden>
              {CONFETTI.map((style, i) => (
                <span key={i} className="confetti absolute rounded-[1px]" style={style} />
              ))}
            </div>
          </div>
          <p className="fade-up mt-7 text-sm font-semibold tracking-[.3em] text-accent uppercase [animation-delay:.3s]">
            Booking confirmed
          </p>
          <h1 className="fade-up mt-3 font-display text-4xl font-bold sm:text-6xl [animation-delay:.4s]">
            See you there, {b.name.split(" ")[0]}!
          </h1>
          <p className="fade-up mt-3 text-muted [animation-delay:.5s]">
            Your slot is locked in. Here&apos;s your entry pass.
          </p>
        </div>

        {/* the pass */}
        <div className="relative mx-auto mt-10 max-w-3xl px-4 drop-shadow-[0_30px_60px_rgb(239_35_60/.35)]">
          <div className="ticket flip-in relative flex flex-col overflow-hidden rounded-3xl bg-panel ring-1 ring-white/10 [animation-delay:.45s] sm:flex-row">
            <div className="shine pointer-events-none absolute inset-0" aria-hidden />

            <div className="flex-1 p-6 text-left sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid h-14 min-w-14 place-items-center rounded-2xl bg-accent px-3 text-on-accent shadow-[0_0_30px_-6px_rgb(239_35_60/.9)]">
                  <Icon name={s.id} className={s.id === "ps4" ? "h-5" : "h-7"} />
                </span>
                <div>
                  <p className="text-xs tracking-widest text-muted uppercase">Station</p>
                  <p className="font-display text-2xl font-bold">{s.name}</p>
                </div>
              </div>

              <div className="mt-7 flex items-end gap-3 font-display font-bold">
                <span className="text-4xl sm:text-5xl">{hourLabel(b.start)}</span>
                <span className="mb-2 text-2xl text-accent">→</span>
                <span className="text-4xl sm:text-5xl">{hourLabel(b.end + 1)}</span>
              </div>

              <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-dashed border-white/10 pt-6 text-sm">
                {[
                  ["Date", date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })],
                  ["Duration", `${hours} hr${hours > 1 ? "s" : ""}`],
                  ["Pay at desk", `₹${b.total}`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs tracking-widest text-muted uppercase">{k}</dt>
                    <dd className="mt-1 font-display text-lg font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-muted">
                Booked for <span className="text-ink">{b.name}</span> · {CAFE.name}, {CAFE.area}
              </p>
            </div>

            <div className="relative flex flex-col items-center justify-center gap-3 border-t-2 border-dashed border-white/15 bg-gradient-to-br from-accent/25 via-accent/5 to-transparent p-6 sm:w-60 sm:border-t-0 sm:border-l-2">
              <div className="relative size-40 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_0_40px_-4px_rgb(239_35_60/.6)]">
                <FakeQR seed={b.id} />
                <div aria-hidden className="qr-scan absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
              </div>
              <p className="font-display text-lg font-bold tracking-wider text-accent">{b.id}</p>
              <p className="text-xs text-muted">Scan at the desk</p>
            </div>
          </div>
        </div>

        <div className="fade-up relative mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3 px-4 [animation-delay:.8s]">
          <button
            onClick={onAgain}
            className="rounded-md bg-accent px-6 py-3 font-semibold text-on-accent shadow-[0_0_30px_-6px_rgb(239_35_60/.8)] transition hover:brightness-110"
          >
            Book another
          </button>
          <a
            href={CAFE.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-line bg-bg/50 px-6 py-3 font-semibold backdrop-blur transition hover:border-muted"
          >
            Get directions
          </a>
          <Link href="/" className="px-4 py-3 font-semibold text-muted transition hover:text-ink">
            Back home
          </Link>
        </div>
        <p className="fade-up relative mt-4 text-center text-sm text-muted [animation-delay:.9s]">
          Please arrive 5 minutes early.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-widest text-accent uppercase">While you wait</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">A look inside the arena</h2>
          </div>
          <p className="text-sm text-muted">{CAFE.area}</p>
        </div>
        <Gallery />
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useSyncExternalStore } from "react";
import { CLOSE_HOUR, OPEN_HOUR, STATIONS, hourLabel, type Station } from "@/lib/stations";

type Booking = {
  id: string;
  station: Station["id"];
  date: string; // YYYY-MM-DD
  start: number;
  end: number; // inclusive start hour of the last slot
  name: string;
  phone: string;
  total: number;
};

const KEY = "ig-bookings";
const HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i);

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function loadBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

// ponytail: mock occupancy, replace with API. Deterministic so the grid is stable across reloads.
function mockBooked(s: Station, date: string, hour: number) {
  let h = 0;
  for (const c of `${s.id}${date}${hour}`) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  const evening = hour >= 18 ? 0.45 : 0;
  return Math.min(s.count, Math.floor(((h % 1000) / 1000) * s.count * 0.8 + s.count * evening));
}

const noop = () => () => {};

export default function BookPage() {
  return (
    <Suspense>
      <Booker />
    </Suspense>
  );
}

function Booker() {
  // Dates and localStorage only exist in the browser; render the grid after hydration.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const param = useSearchParams().get("station");
  const initial = STATIONS.find((s) => s.id === param) ?? STATIONS[0];

  const [station, setStation] = useState<Station>(initial);
  const [dayIdx, setDayIdx] = useState(0);
  const [sel, setSel] = useState<{ start: number; end: number } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(() =>
    typeof window === "undefined" ? [] : loadBookings(),
  );
  const [done, setDone] = useState<Booking | null>(null);

  const now = mounted ? new Date() : null;
  const days = now
    ? Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i))
    : [];
  const date = days[dayIdx] ? isoDate(days[dayIdx]) : "";

  const free = (h: number) => {
    const mine = bookings.filter(
      (b) => b.station === station.id && b.date === date && h >= b.start && h <= b.end,
    ).length;
    return Math.max(0, station.count - mockBooked(station, date, h) - mine);
  };
  const isPast = (h: number) => dayIdx === 0 && !!now && h <= now.getHours();

  function pick(h: number) {
    if (!sel) return setSel({ start: h, end: h });
    const { start, end } = sel;
    if (h === end + 1) return setSel({ start, end: h });
    if (h === start - 1) return setSel({ start: h, end });
    if (start === end && h === start) return setSel(null);
    if (h === end) return setSel({ start, end: end - 1 });
    if (h === start) return setSel({ start: start + 1, end });
    setSel({ start: h, end: h });
  }

  const hours = sel ? sel.end - sel.start + 1 : 0;
  const total = hours * station.pricePerHour;

  function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sel) return;
    const f = new FormData(e.currentTarget);
    const b: Booking = {
      id: "IG-" + crypto.randomUUID().slice(0, 6).toUpperCase(),
      station: station.id,
      date,
      ...sel,
      name: String(f.get("name")).trim(),
      phone: String(f.get("phone")),
      total,
    };
    const next = [...bookings, b];
    setBookings(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setSel(null);
    setDone(b);
  }

  if (done) {
    const s = STATIONS.find((x) => x.id === done.station)!;
    return (
      <section className="mx-auto max-w-lg px-4 py-20">
        <div className="rounded-xl border border-accent/40 bg-panel p-8">
          <p className="text-sm font-medium tracking-widest text-accent uppercase">Booking confirmed</p>
          <h1 className="mt-3 font-display text-3xl font-bold">See you there, {done.name.split(" ")[0]}!</h1>
          <dl className="mt-8 grid grid-cols-2 gap-y-4 text-sm">
            <dt className="text-muted">Booking ID</dt>
            <dd className="font-display font-bold text-accent">{done.id}</dd>
            <dt className="text-muted">Station</dt>
            <dd>{s.name}</dd>
            <dt className="text-muted">Date</dt>
            <dd>
              {new Date(done.date + "T00:00").toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </dd>
            <dt className="text-muted">Time</dt>
            <dd>
              {hourLabel(done.start)} – {hourLabel(done.end + 1)}
            </dd>
            <dt className="text-muted">Pay at counter</dt>
            <dd className="font-semibold">₹{done.total}</dd>
          </dl>
          <p className="mt-8 text-sm text-muted">
            Show this ID at the desk. Please arrive 5 minutes early.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setDone(null)}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg hover:brightness-110"
            >
              Book another
            </button>
            <Link href="/" className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold hover:border-muted">
              Back home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Book a slot</h1>
      <p className="mt-3 text-muted">Pick a station, a day, and one or more back-to-back hours.</p>

      {/* 1. Station */}
      <h2 className="mt-10 mb-3 text-sm font-semibold tracking-widest text-muted uppercase">1 · Station</h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {STATIONS.map((s) => (
          <button
            key={s.id}
            aria-pressed={s.id === station.id}
            onClick={() => {
              setStation(s);
              setSel(null);
            }}
            className="shrink-0 rounded-md border border-line px-4 py-2.5 text-left transition hover:border-muted aria-pressed:border-accent aria-pressed:bg-accent/10"
          >
            <span className="block font-semibold">{s.name}</span>
            <span className="text-xs text-muted">₹{s.pricePerHour}/hr</span>
          </button>
        ))}
      </div>

      {/* 2. Day */}
      <h2 className="mt-8 mb-3 text-sm font-semibold tracking-widest text-muted uppercase">2 · Day</h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {mounted
          ? days.map((d, i) => (
              <button
                key={i}
                aria-pressed={i === dayIdx}
                onClick={() => {
                  setDayIdx(i);
                  setSel(null);
                }}
                className="w-16 shrink-0 rounded-md border border-line py-2 text-center transition hover:border-muted aria-pressed:border-accent aria-pressed:bg-accent/10"
              >
                <span className="block text-xs text-muted">
                  {i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className="block font-display text-xl font-bold">{d.getDate()}</span>
              </button>
            ))
          : Array.from({ length: 7 }, (_, i) => <div key={i} className="h-16 w-16 shrink-0 rounded-md bg-panel" />)}
      </div>

      {/* 3. Time */}
      <h2 className="mt-8 mb-3 text-sm font-semibold tracking-widest text-muted uppercase">3 · Time</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {HOURS.map((h) => {
          if (!mounted) return <div key={h} className="h-16 rounded-md bg-panel" />;
          const n = free(h);
          const disabled = isPast(h) || n === 0;
          const on = !!sel && h >= sel.start && h <= sel.end;
          return (
            <button
              key={h}
              disabled={disabled}
              aria-pressed={on}
              onClick={() => pick(h)}
              className="h-16 rounded-md border border-line bg-panel transition enabled:hover:border-muted disabled:cursor-not-allowed disabled:opacity-35 aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-bg"
            >
              <span className="block font-semibold">{hourLabel(h)}</span>
              <span className="block text-xs opacity-75">
                {isPast(h) ? "Past" : n === 0 ? "Full" : `${n}/${station.count} free`}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Details */}
      {sel && (
        <form
          onSubmit={confirm}
          className="mt-10 grid gap-6 rounded-xl border border-line bg-panel p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end"
        >
          <div className="lg:col-span-3">
            <p className="text-sm text-muted">
              {station.name} · {hourLabel(sel.start)} – {hourLabel(sel.end + 1)}
            </p>
            <p className="mt-1 font-display text-2xl font-bold">
              {hours} hr × ₹{station.pricePerHour} = <span className="text-accent">₹{total}</span>
            </p>
          </div>
          <label className="block text-sm">
            <span className="text-muted">Your name</span>
            <input
              name="name"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Phone</span>
            <input
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              title="10-digit mobile number"
              autoComplete="tel-national"
              className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>
          <button className="rounded-md bg-accent px-6 py-3 font-semibold text-bg hover:brightness-110">
            Confirm booking
          </button>
        </form>
      )}
    </section>
  );
}

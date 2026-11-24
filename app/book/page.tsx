"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/Icon";
import Confirmed, { type Booking } from "./Confirmed";
import { CAFE } from "@/lib/cafe";
import { STATIONS, hourLabel, type Station } from "@/lib/stations";

const KEY = "ig-bookings";
const HOURS = Array.from({ length: CAFE.close - CAFE.open }, (_, i) => CAFE.open + i);

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
    scrollTo({ top: 0 });
  }

  if (done) return <Confirmed booking={done} onAgain={() => setDone(null)} />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Book a slot</h1>
      <p className="mt-3 text-muted">Pick a day, a station, and one or more back-to-back hours.</p>

      {/* 1. Day */}
      <h2 className="mt-10 mb-3 text-sm font-semibold tracking-widest text-muted uppercase">1 · Day</h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:flex-wrap">
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

      {/* 2. Station */}
      <h2 className="mt-8 mb-3 text-sm font-semibold tracking-widest text-muted uppercase">2 · Station</h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:flex-wrap">
        {STATIONS.map((s) => (
          <button
            key={s.id}
            aria-pressed={s.id === station.id}
            onClick={() => {
              setStation(s);
              setSel(null);
            }}
            className="group flex shrink-0 items-center gap-3 rounded-md border border-line px-4 py-2.5 text-left transition hover:border-muted aria-pressed:border-accent aria-pressed:bg-accent/10"
          >
            <span className="grid h-10 min-w-10 place-items-center rounded-md px-2 bg-white/5 text-muted transition group-aria-pressed:bg-accent group-aria-pressed:text-on-accent">
              <Icon name={s.id} className={s.id === "ps4" ? "h-4" : "h-6"} />
            </span>
            <span>
              <span className="block font-semibold">{s.name}</span>
              <span className="text-xs text-muted">₹{s.pricePerHour}/hr</span>
            </span>
          </button>
        ))}
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
              className="h-16 rounded-md border border-line bg-panel transition enabled:hover:border-muted disabled:cursor-not-allowed disabled:opacity-35 aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
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
          <button className="rounded-md bg-accent px-6 py-3 font-semibold text-on-accent hover:brightness-110">
            Confirm booking
          </button>
        </form>
      )}
    </section>
  );
}

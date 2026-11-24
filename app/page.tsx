import Link from "next/link";
import { CAFE, STATIONS } from "@/lib/stations";

const PERKS = [
  ["Fully air-conditioned", "Long sessions without the sweat. Comfy seating at every station."],
  ["Latest titles, updated", "New releases installed as they drop. Ask at the desk for the full list."],
  ["Weekend tournaments", "FC, Tekken and Valorant brackets with prize pools for the top players."],
  ["Book ahead, skip the wait", "Reserve your slot online and walk straight to your seat."],
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <p className="mb-5 text-sm font-medium tracking-widest text-accent uppercase">
            {CAFE.area}
          </p>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] font-bold sm:text-7xl">
            Every game.
            <br />
            One <span className="text-accent">infinite</span> arena.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            PS5, PS4, high-refresh gaming PCs, snooker, a racing sim and VR, all under one
            roof. Pick your station, pick your time, show up and play.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-md bg-accent px-6 py-3 font-semibold text-bg transition hover:brightness-110"
            >
              Book your slot
            </Link>
            <a
              href="#stations"
              className="rounded-md border border-line px-6 py-3 font-semibold transition hover:border-muted"
            >
              See what we have
            </a>
          </div>
          <dl className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              [STATIONS.reduce((n, s) => n + s.count, 0) + "+", "Stations"],
              ["13 hrs", "Open daily"],
              ["₹" + Math.min(...STATIONS.map((s) => s.pricePerHour)), "From / hr"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-bold">{v}</dd>
                <dd className="text-sm text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Stations + pricing */}
      <section id="stations" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Pick your battlefield</h2>
          <p className="mt-3 text-muted">Simple hourly pricing. No membership needed.</p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {STATIONS.map((s) => (
              <li key={s.id} className="flex flex-col bg-panel p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-bold">{s.name}</h3>
                  <p className="shrink-0 font-display text-accent">
                    <span className="text-2xl font-bold">₹{s.pricePerHour}</span>
                    <span className="text-sm text-muted">/hr</span>
                  </p>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{s.tagline}</p>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-muted">
                    {s.count} {s.unit}
                    {s.count > 1 ? "s" : ""}
                  </span>
                  <Link href={`/book?station=${s.id}`} className="font-semibold text-accent hover:underline">
                    Book →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Built for players, by players
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {PERKS.map(([t, d]) => (
              <div key={t} className="border-l-2 border-accent pl-4">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Find us</h2>
            <p className="mt-4 text-lg">{CAFE.area}</p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Hours</dt>
                <dd className="mt-1">Every day, 10 AM – 11 PM</dd>
              </div>
              <div>
                <dt className="text-muted">Call</dt>
                <dd className="mt-1">{CAFE.phone}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CAFE.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-muted"
              >
                Get directions
              </a>
              <Link
                href="/book"
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:brightness-110"
              >
                Book a slot
              </Link>
            </div>
          </div>
          <iframe
            src={CAFE.mapsEmbed}
            title={`${CAFE.name} on Google Maps`}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-xl border border-line grayscale invert-[.9] hue-rotate-180"
          />
        </div>
      </section>
    </>
  );
}

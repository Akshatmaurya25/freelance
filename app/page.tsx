import Link from "next/link";
import { CAFE, STATIONS } from "@/lib/stations";
import Hero from "@/components/Hero";
import GameLibrary from "@/components/GameLibrary";
import Snooker from "@/components/Snooker";
import HomeFx from "@/components/HomeFx";
import Gallery from "@/components/Gallery";
import { Icon } from "@/components/Icon";

const PERKS: [Parameters<typeof Icon>[0]["name"], string, string][] = [
  ["ac", "Fully air-conditioned", "Long sessions without the sweat. Comfy seating at every station."],
  ["new", "Latest titles, updated", "New releases installed as they drop. Ask at the desk for the full list."],
  ["trophy", "Weekend tournaments", "FC, Tekken and Valorant brackets with prize pools for the top players."],
  ["calendar", "Book ahead, skip the wait", "Reserve your slot online and walk straight to your seat."],
];

const TICKER = ["PlayStation 5", "Gaming PCs", "Snooker", "Racing Sim", "VR Zone", "PlayStation 4"];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Ticker bands sliding in opposite directions */}
      <div className="overflow-hidden border-y border-line py-8 select-none" aria-hidden>
        <div className="-mx-[5%] -rotate-2">
          <div className="marquee">
            {[...TICKER, ...TICKER].map((w, i) => (
              <span key={i} className="px-6 font-display text-5xl font-bold uppercase sm:text-7xl">
                {w} <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
          <div className="marquee mt-2" data-dir="right">
            {[...TICKER, ...TICKER].reverse().map((w, i) => (
              <span key={i} className="text-outline px-6 font-display text-5xl font-bold uppercase sm:text-7xl">
                {w} ✦
              </span>
            ))}
          </div>
        </div>
      </div>

      <GameLibrary />

      {/* Stations + pricing */}
      <section id="stations" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 data-reveal="left" className="font-display text-3xl font-bold sm:text-5xl">
            Pick your battlefield
          </h2>
          <p data-reveal="right" className="mt-3 text-muted">
            Simple hourly pricing. No membership needed.
          </p>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STATIONS.map((s, i) => (
              <li key={s.id} data-reveal={["left", "up", "right"][i % 3]} className={s.id === "ps5" || s.id === "pc" ? "lg:col-span-2" : ""}>
                <div
                  data-tilt
                  className="glare group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-[0_0_50px_-12px_rgb(239_35_60/.6)]"
                >
                  <span
                    aria-hidden
                    className="absolute -top-4 -right-2 font-display text-8xl font-bold text-white/[.04] transition group-hover:text-accent/10"
                  >
                    0{i + 1}
                  </span>
                  <span className="relative mb-5 grid h-14 w-fit min-w-14 place-items-center rounded-xl px-3 bg-accent/10 text-accent ring-1 ring-accent/30 transition group-hover:scale-110 group-hover:bg-accent group-hover:text-on-accent">
                    <Icon name={s.id} className={s.id === "ps4" ? "h-5" : "h-7"} />
                  </span>
                  <div className="relative flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl font-bold">{s.name}</h3>
                    <p className="shrink-0 font-display text-accent">
                      <span className="text-2xl font-bold">₹{s.pricePerHour}</span>
                      <span className="text-sm text-muted">/hr</span>
                    </p>
                  </div>
                  <p className="relative mt-2 flex-1 text-sm text-muted">{s.tagline}</p>
                  <div className="relative mt-6 flex items-center justify-between text-sm">
                    <span className="text-muted">
                      {s.count} {s.unit}
                      {s.count > 1 ? "s" : ""}
                    </span>
                    <Link href={`/book?station=${s.id}`} className="font-semibold text-accent hover:underline">
                      Book →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Snooker />

      {/* Real photos */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <p data-reveal="left" className="text-sm font-medium tracking-widest text-accent uppercase">
            Inside the arena
          </p>
          <h2 data-reveal="left" className="mt-2 font-display text-3xl font-bold sm:text-5xl">
            Come see it for yourself
          </h2>
          <div className="mt-10">
            <Gallery reveal />
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 lg:grid-cols-[1fr_2fr]">
          <h2 data-reveal="left" className="font-display text-3xl font-bold sm:text-5xl">
            Built for players, by players
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {PERKS.map(([icon, t, d], i) => (
              <div key={t} data-reveal={i % 2 ? "right" : "left"}>
                <div
                  data-tilt
                  className="glare group relative flex h-full gap-4 rounded-2xl border border-line bg-panel/60 p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-[0_0_40px_-14px_rgb(239_35_60/.7)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30 transition group-hover:bg-accent group-hover:text-on-accent">
                    <Icon name={icon} />
                  </span>
                  <div>
                    <h3 className="font-semibold">{t}</h3>
                    <p className="mt-1 text-sm text-muted">{d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 lg:grid-cols-2">
          <div data-reveal="left">
            <h2 className="font-display text-3xl font-bold sm:text-5xl">Find us</h2>
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
                data-magnetic
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:brightness-110"
              >
                Book a slot
              </Link>
            </div>
          </div>
          <iframe
            data-reveal="right"
            src={CAFE.mapsEmbed}
            title={`${CAFE.name} on Google Maps`}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-xl border border-line grayscale invert-[.9] hue-rotate-180"
          />
        </div>
      </section>

      <HomeFx />
    </>
  );
}

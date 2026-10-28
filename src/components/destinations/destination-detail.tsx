import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, MapPin, Star } from "lucide-react";
import {
  formatDepartureDate,
  formatPrice,
  withImageParams,
  type Destination,
} from "@/lib/destinations";
import BookNowButton from "@/components/ui/book-now-button";
import EditDestinationDialog from "./editDialog";
import DeleteDestinationDialog from "./deleteDialog";

const RATING = 4.9;
const REVIEW_COUNT = 234;

const perks = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];

const highlightsByCategory: Record<string, string[]> = {
  beach: [
    "Beachfront accommodation",
    "Traditional spa treatment",
    "Sunrise trek to Mount Batur",
    "Private beach dinner experience",
    "Snorkeling and island hopping",
    "Guided tour of local temples",
  ],
  mountain: [
    "Scenic alpine train journeys",
    "Cozy chalet accommodation",
    "Guided summit hike",
    "Panoramic mountain viewpoints",
    "Traditional fondue dinner",
    "Free time to explore alpine villages",
  ],
  city: [
    "Central boutique accommodation",
    "Guided city highlights tour",
    "Skip-the-line museum entry",
    "Local street food tasting",
    "Evening skyline experience",
    "Free day for independent exploring",
  ],
  cultural: [
    "Expert local guide",
    "Entry to historic landmarks",
    "Traditional evening performance",
    "Authentic regional dining",
    "Hands-on craft workshop",
    "Curated museum visits",
  ],
  adventure: [
    "Expert adventure guides",
    "All equipment included",
    "Small-group departures",
    "Scenic transfers",
    "Two guided excursions",
    "Free time for optional activities",
  ],
};

const fallbackHighlights = [
  "Carefully selected accommodation",
  "Local expert guides",
  "Daily breakfast included",
  "Comfortable transfers",
  "Curated excursions",
  "Free time to explore at your own pace",
];

const backLinkClass =
  "inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-[#10a5c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2";

export default function DestinationDetail({
  destination,
}: {
  destination: Destination;
}) {
  const highlights =
    highlightsByCategory[destination.category.toLowerCase()] ??
    fallbackHighlights;

  const description =
    destination.description ||
    `Discover ${destination.destinationName} in ${destination.country} with Wanderlast.`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/destinations" className={backLinkClass}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Back to Destinations
        </Link>

        <div className="flex items-center gap-3">
          <EditDestinationDialog destination={destination} />
          <DeleteDestinationDialog destination={destination} />
        </div>
      </div>

      <div className="mt-6 relative aspect-16/7 w-full overflow-hidden bg-neutral-100">
        {destination.imageUrl ? (
          <Image
            src={withImageParams(destination.imageUrl, 1600)}
            alt={destination.destinationName}
            fill
            unoptimized
            preload
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin
              className="h-3.5 w-3.5"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            {destination.country}
          </p>

          <h1 className="mt-3 text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
            {destination.destinationName}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Star
                className="h-3.5 w-3.5 fill-[#1a9c5b] text-[#1a9c5b]"
                aria-hidden="true"
              />
              <span className="font-semibold text-neutral-900">{RATING}</span>
              <span>({REVIEW_COUNT} reviews)</span>
            </span>

            <span className="h-3.5 w-px bg-neutral-300" aria-hidden="true" />

            <span className="flex items-center gap-1.5">
              <CalendarDays
                className="h-3.5 w-3.5"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              {destination.duration}
            </span>
          </div>

          <section className="mt-8" aria-labelledby="overview-heading">
            <h2
              id="overview-heading"
              className="text-2xl font-normal text-neutral-900"
            >
              Overview
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-500">
              {description}
            </p>
          </section>

          <section className="mt-8" aria-labelledby="highlights-heading">
            <h2
              id="highlights-heading"
              className="text-2xl font-normal text-neutral-900"
            >
              Highlights
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-500">
              Here is what you can look forward to on this trip.
            </p>

            <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#1a9c5b]"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-label="Booking summary">
          <div className="border border-neutral-200 bg-white p-6">
            <p className="text-[13px] text-neutral-500">Starting from</p>
            <p className="mt-1 text-3xl font-semibold text-[#10a5c4]">
              {formatPrice(destination.price)}
            </p>
            <p className="text-[13px] text-neutral-500">per person</p>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Departure date
              </p>
              <p className="mt-2 flex h-11 items-center gap-2 border border-neutral-200 bg-[#f9fafb] px-3 text-sm text-neutral-700">
                <CalendarDays
                  className="h-4 w-4 text-neutral-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                {formatDepartureDate(destination.departureDate)}
              </p>
            </div>

            <BookNowButton destination={destination} />

            <ul className="mt-6 space-y-2.5">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2 text-sm text-neutral-600"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#1a9c5b]"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Star } from "lucide-react";
import {
  formatPrice,
  withImageParams,
  type Destination,
} from "@/lib/destinations";

export default function DestinationCard({
  destination,
}: {
  destination: Destination;
}) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/destinations/${destination._id}`}
        className="relative block aspect-16/10 overflow-hidden bg-neutral-100"
      >
        {destination.imageUrl ? (
          <Image
            src={withImageParams(destination.imageUrl)}
            alt={destination.destinationName}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-sm bg-white/95 px-2 py-1 text-[11px] font-semibold text-neutral-900 shadow-sm">
          4.5
          <Star
            className="h-3 w-3 fill-neutral-900 text-neutral-900"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="sr-only">out of 5</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <MapPin
            className="h-3.5 w-3.5"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          {destination.country}
        </p>

        <div className="mt-1 flex items-baseline justify-between gap-3">
          <Link
            href={`/destinations/${destination._id}`}
            className="text-base font-medium text-neutral-900 transition-colors hover:text-[#10a5c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2"
          >
            {destination.destinationName}
          </Link>
          <p className="shrink-0 text-sm font-semibold text-neutral-900">
            {formatPrice(destination.price)}
            <span className="text-[10px] font-light text-neutral-500">
              /Person
            </span>
          </p>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
          <CalendarDays
            className="h-3.5 w-3.5"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          {destination.duration}
        </p>

        <Link
          href={`/destinations/${destination._id}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#10a5c4] hover:underline"
        >
          Book Now
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

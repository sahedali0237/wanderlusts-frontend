import { Suspense } from "react";
import type { Metadata } from "next";
import DestinationExplorer from "@/components/destinations/destination-explorer";
import DestinationsSkeleton from "@/components/destinations/destinations-skeleton";
import { getDestinations } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Explore All Destinations | Wanderlast",
  description:
    "Find your perfect travel experience from our curated collection of destinations.",
};

async function DestinationResults() {
  const destinations = await getDestinations();

  return <DestinationExplorer destinations={destinations} />;
}

export default function DestinationsPage() {
  return (
    <section
      aria-labelledby="destinations-heading"
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 lg:px-12 lg:py-14 bg-white"
    >
      <h1
        id="destinations-heading"
        className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl"
      >
        Explore All Destinations
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Find your perfect travel experience from our curated collection
      </p>

      <Suspense fallback={<DestinationsSkeleton />}>
        <DestinationResults />
      </Suspense>
    </section>
  );
}

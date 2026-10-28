"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Destination } from "@/lib/destinations";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import DestinationCard from "@/components/destinations/destination-card";

interface DestinationsCarouselProps {
  apiUrl?: string;
  autoScrollInterval?: number;
}

export default function DestinationsCarousel({
  apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/destination`,
  autoScrollInterval = 3000,
}: DestinationsCarouselProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data: Destination[] = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error("Unable to fetch destinations:", error);
      }
    };
    fetchDestinations();
  }, [apiUrl]);

  // Auto-scroll effect
  useEffect(() => {
    if (!api || destinations.length === 0) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        // Loop back to start using scrollTo
        api.scrollTo(0);
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [api, destinations.length, autoScrollInterval]);

  if (destinations.length === 0) {
    return (
      <section
        aria-labelledby="destinations-heading"
        className="w-full bg-white px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-neutral-500">Loading destinations...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="destinations-heading"
      className="w-full bg-white px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-nowrap items-center justify-between gap-4">
          <div className="shrink-0">
            <h2
              id="destinations-heading"
              className="font-serif text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl"
            >
              Popular <span className="font-bold">Destinations</span>
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Explore our most sought-after travel experiences
            </p>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 font-semibold text-sm text-[#10a5c4] hover:text-[#0e8ea9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2"
          >
            All Collection
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            loop: true,
            dragFree: true,
          }}
          setApi={setApi}
          plugins={[]}
          className="relative mt-8"
        >
          <CarouselContent className="flex gap-4">
            {destinations.map((destination) => (
              <CarouselItem key={destination._id} className="basis-[320px] sm:basis-[360px] lg:basis-[400px]">
                <DestinationCard destination={destination} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="ghost"
            size="icon-lg"
            className="bg-white/80 hover:bg-white hover:shadow-lg"
            aria-label="Previous destination"
          />
          <CarouselNext
            variant="ghost"
            size="icon-lg"
            className="bg-white/80 hover:bg-white hover:shadow-lg"
            aria-label="Next destination"
          />
        </Carousel>
      </div>
    </section>
  );
}
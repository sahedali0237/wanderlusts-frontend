"use client";

import { useState } from "react";
import {
  formatCategory,
  toPriceNumber,
  type Destination,
} from "@/lib/destinations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DestinationCard from "./destination-card";

const ALL = "all";

type PriceRange = {
  value: string;
  label: string;
  min?: number;
  max?: number;
};

const priceRanges: PriceRange[] = [
  { value: ALL, label: "Any Price" },
  { value: "under-1500", label: "Under $1,500", max: 1500 },
  { value: "1500-2000", label: "$1,500 - $2,000", min: 1500, max: 2000 },
  { value: "over-2000", label: "Over $2,000", min: 2000 },
];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "departure", label: "Departure Date" },
];

const triggerClassName =
  "h-11 w-full justify-between rounded-md border border-neutral-300 bg-white px-3 text-xs font-medium uppercase tracking-[0.06em] text-neutral-600 shadow-none transition-colors hover:border-neutral-400 focus-visible:border-[#10a5c4] focus-visible:ring-0 data-placeholder:text-neutral-500 [&_svg:not([class*='size-'])]:size-4";

export default function DestinationExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const categories = Array.from(
    new Set(
      destinations
        .map((destination) => destination.category)
        .filter((value) => value.length > 0),
    ),
  ).sort();

  // Pass the options to the select root so the trigger label can be resolved
  // even before the popup (and its items) has been mounted.
  const categoryItems = [
    { value: ALL, label: "All Categories" },
    ...categories.map((value) => ({
      value,
      label: formatCategory(value),
    })),
  ];

  const selectedRange =
    priceRanges.find((range) => range.value === priceRange) ?? priceRanges[0];

  const visibleDestinations = destinations
    .filter(
      (destination) =>
        category === null ||
        category === ALL ||
        destination.category.toLowerCase() === category.toLowerCase(),
    )
    .filter((destination) => {
      const price = toPriceNumber(destination.price);
      return (
        price >= (selectedRange.min ?? 0) &&
        price < (selectedRange.max ?? Number.POSITIVE_INFINITY)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return toPriceNumber(a.price) - toPriceNumber(b.price);
      }
      if (sortBy === "price-desc") {
        return toPriceNumber(b.price) - toPriceNumber(a.price);
      }
      if (sortBy === "departure") {
        const aDate = new Date(a.departureDate).getTime() || 0;
        const bDate = new Date(b.departureDate).getTime() || 0;
        return aDate - bDate;
      }
      return 0;
    });

  const hasFilters =
    category !== null || priceRange !== null || sortBy !== null;

  function resetFilters() {
    setCategory(null);
    setPriceRange(null);
    setSortBy(null);
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          items={categoryItems}
          value={category}
          onValueChange={(value) => setCategory(value ?? null)}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className={triggerClassName}
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL}>All Categories</SelectItem>
            {categories.map((value) => (
              <SelectItem key={value} value={value}>
                {formatCategory(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={priceRanges}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value ?? null)}
        >
          <SelectTrigger
            aria-label="Filter by price range"
            className={triggerClassName}
          >
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent align="start">
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={sortOptions}
          value={sortBy}
          onValueChange={(value) => setSortBy(value ?? null)}
        >
          <SelectTrigger
            aria-label="Sort destinations"
            className={triggerClassName}
          >
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent align="start">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-5 text-[13px] text-neutral-500" aria-live="polite">
        Showing {visibleDestinations.length} destination
        {visibleDestinations.length === 1 ? "" : "s"}
      </p>

      {visibleDestinations.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDestinations.map((destination) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-300 px-6 py-16 text-center">
          <p className="text-base font-medium text-neutral-900">
            {destinations.length === 0
              ? "No destinations available right now"
              : "No destinations match your filters"}
          </p>
          <p className="max-w-md text-sm text-neutral-500">
            {destinations.length === 0
              ? "Please check back soon, new trips are added regularly."
              : "Try changing the category or price range to see more trips."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#10a5c4] transition-colors hover:text-[#0e8ea9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </>
  );
}

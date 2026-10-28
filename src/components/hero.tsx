import Image from "next/image";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$3000" },
  { label: "People", placeholder: "5-10" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-70px)] w-full flex-col overflow-hidden">
      {/* Background image + shade */}
      <Image
        src="/assets/Banner.png"
        alt="Scenic coastal bay surrounded by forested hills"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-4 text-center text-white lg:pb-16 lg:pt-0">
        <h1 className="text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[96px]">
          Discover Your
          <br />
          Next Adventure
        </h1>

        <p className="mt-8 max-w-160 text-base font-light leading-relaxed text-white/95 drop-shadow-md sm:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with
          <br className="hidden md:block" /> our curated travel experiences.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            className="group flex h-14 min-w-50 items-center justify-center gap-3 bg-[#10a5c4] px-6 text-sm font-semibold tracking-[0.08em] text-white transition-colors hover:bg-[#0e8ea9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            EXPLORE NOW
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </button>
          <button
            type="button"
            className="flex h-14 min-w-50 items-center justify-center border border-white/40 bg-white/20 px-6 text-sm font-semibold tracking-[0.08em] text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            VIEW DESTINATION
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative z-10 mt-auto w-full border-t border-white/20 bg-black/25 backdrop-blur-md lg:absolute lg:bottom-0 lg:left-0">
        <div className="grid w-full grid-cols-2 lg:flex lg:items-stretch">
          {searchFields.map((field) => (
            <div
              key={field.label}
              className="border-b border-white/15 px-6 py-4 text-white odd:border-r lg:flex-1 lg:border-b-0 lg:border-r lg:border-white/15"
            >
              <p className="text-lg font-semibold leading-tight">
                {field.label}
              </p>
              <p className="mt-1 text-sm font-light text-gray-200">
                {field.placeholder}
              </p>
            </div>
          ))}

          <button
            type="button"
            className="col-span-2 flex items-center justify-center bg-[#10a5c4] px-8 py-4 text-xl font-semibold text-white transition-colors hover:bg-[#0e8ea9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-inset lg:w-50 lg:shrink-0 lg:py-0 lg:text-2xl"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

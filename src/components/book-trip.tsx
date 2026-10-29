import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BookTrip() {
  return (
    <section
      aria-labelledby="book-trip-heading"
      className="relative isolate flex min-h-85 w-full items-center justify-center overflow-hidden px-4 py-20 text-center sm:min-h-105 lg:py-24"
    >
      <Image
        src="/assets/CTA.png"
        alt="Airplane flying over a tropical island"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#062b35]/60" />

      <div className="relative z-10 mx-auto max-w-4xl text-white">
        <h2
          id="book-trip-heading"
          className="font-serif text-4xl font-normal tracking-tight text-balance sm:text-5xl"
        >
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 text-sm text-white/85 sm:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="/destinations"
          className="mt-8 inline-flex h-12 items-center justify-center gap-3 bg-white px-6 text-xs font-semibold tracking-[0.1em] text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#062b35]"
        >
          BOOK YOUR TRIP TODAY
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}

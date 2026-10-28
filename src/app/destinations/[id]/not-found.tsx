import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DestinationNotFound() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#10a5c4]">
        404
      </p>
      <h1 className="mt-3 text-3xl font-normal tracking-tight text-neutral-900">
        Destination not found
      </h1>
      <p className="mt-3 text-sm leading-7 text-neutral-500">
        The destination you are looking for may have been removed or is
        temporarily unavailable.
      </p>

      <Link
        href="/destinations"
        className="mt-8 inline-flex h-11 items-center justify-center gap-2 bg-[#10a5c4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#0e8ea9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a5c4] focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        Back to Destinations
      </Link>
    </section>
  );
}

const pulse = "animate-pulse rounded-sm bg-neutral-200";

export default function DestinationsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`${pulse} h-11 rounded-md`} />
        ))}
      </div>

      <div className="mt-5 h-4 w-40 animate-pulse rounded-sm bg-neutral-200" />

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <div className="aspect-16/10 w-full animate-pulse bg-neutral-200" />
            <div className="pt-3">
              <div className="h-3 w-24 animate-pulse rounded-sm bg-neutral-200" />
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="h-4 w-32 animate-pulse rounded-sm bg-neutral-200" />
                <div className="h-4 w-20 animate-pulse rounded-sm bg-neutral-200" />
              </div>
              <div className="mt-2 h-3 w-28 animate-pulse rounded-sm bg-neutral-200" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded-sm bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

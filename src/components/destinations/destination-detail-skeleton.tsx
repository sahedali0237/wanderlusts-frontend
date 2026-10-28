const pulse = "animate-pulse rounded-sm bg-neutral-200";

export default function DestinationDetailSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`${pulse} h-4 w-40`} />
        <div className="flex items-center gap-3">
          <div className={`${pulse} h-9 w-20`} />
          <div className={`${pulse} h-9 w-24`} />
        </div>
      </div>

      <div className={`${pulse} mt-6 aspect-16/7 w-full`} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div>
          <div className={`${pulse} h-3 w-24`} />
          <div className={`${pulse} mt-4 h-9 w-2/3`} />
          <div className={`${pulse} mt-4 h-4 w-64`} />

          <div className={`${pulse} mt-10 h-6 w-32`} />
          <div className={`${pulse} mt-4 h-4 w-full`} />
          <div className={`${pulse} mt-2 h-4 w-11/12`} />
          <div className={`${pulse} mt-2 h-4 w-4/5`} />

          <div className={`${pulse} mt-10 h-6 w-32`} />
          <div className={`${pulse} mt-4 h-4 w-2/3`} />
          <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={`${pulse} h-4 w-40`} />
            ))}
          </div>
        </div>

        <div className={`${pulse} h-80 w-full`} />
      </div>
    </div>
  );
}

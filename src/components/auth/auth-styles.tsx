export const inputClass =
  "h-10 rounded-sm border-neutral-200/80 bg-[#f9fafb] pl-10 pr-3 text-sm text-neutral-800 shadow-none transition-colors placeholder:text-neutral-400 focus-visible:border-[#10a5c4] focus-visible:ring-3 focus-visible:ring-[#10a5c4]/20";

export const labelClass = "mb-2 text-[13px] font-medium text-neutral-800";

export const iconClass =
  "pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400";

export const primaryButtonClass =
  "h-10 w-full rounded-sm bg-[#10a5c4] text-sm font-medium text-white transition-colors hover:bg-[#0e8ea9] focus-visible:ring-[#10a5c4]/40";

export const googleButtonClass =
  "h-10 w-full gap-2.5 rounded-sm border-neutral-200 bg-white text-[13px] font-normal text-neutral-700 shadow-none hover:bg-neutral-50";

export const linkClass =
  "font-medium text-[#10a5c4] transition-colors hover:text-[#0e8ea9] hover:underline";

export const errorClass =
  "border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive";

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-neutral-200" />
      <span className="text-[13px] text-neutral-500">{label}</span>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

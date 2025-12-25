import { cn, getInitials } from "@/utils/helpers";

export default function Avatar({ name, className }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-100",
        className
      )}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}

import { cn } from "@/utils/helpers";

const VARIANTS = {
  default: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function Badge({ variant = "default", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        VARIANTS[variant] || VARIANTS.default,
        className
      )}
    >
      {children}
    </span>
  );
}

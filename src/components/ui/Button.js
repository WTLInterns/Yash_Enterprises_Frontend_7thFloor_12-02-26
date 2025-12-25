import { cn } from "@/utils/helpers";

const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export default function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant] || VARIANTS.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

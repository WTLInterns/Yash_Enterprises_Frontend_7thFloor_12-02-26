import { cn } from "@/utils/helpers";

export default function Card({ className, children }) {
  return (
    <div className={cn("rounded-2xl bg-white shadow-sm ring-1 ring-slate-200", className)}>
      {children}
    </div>
  );
}

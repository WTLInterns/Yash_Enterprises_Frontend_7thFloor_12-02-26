import Card from "@/components/ui/Card";
import { cn } from "@/utils/helpers";

export default function StatCard({ title, value, subtitle, icon, accent = "indigo", className }) {
  const accentMap = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
  };

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-600">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          {subtitle ? <div className="mt-2 text-xs leading-5 text-slate-500">{subtitle}</div> : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
            accentMap[accent] || accentMap.indigo
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

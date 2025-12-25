import Card from "@/components/ui/Card";

export default function TeamwiseAttendance({ items = [] }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-slate-900">Teamwise Attendance</div>
      <div className="mt-1 text-xs text-slate-500">Punch breakdown by team</div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((t) => (
            <div key={t.teamName} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-900">{t.teamName}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-900">{t.punchedIn}</span>
                </div>
                <div className="flex items-center gap-2 text-rose-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-900">{t.punchedOut}</span>
                </div>
                <div className="w-8 text-right text-xs font-medium text-slate-500">{t.total}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="text-sm font-semibold text-slate-900">No teams found</div>
            <div className="mt-1 text-xs text-slate-500">Teamwise stats will appear here.</div>
          </div>
        )}
      </div>
    </Card>
  );
}

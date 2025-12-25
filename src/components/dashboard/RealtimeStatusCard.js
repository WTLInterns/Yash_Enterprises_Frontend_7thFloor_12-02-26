import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { clamp } from "@/utils/helpers";

function Gauge({ value = 0, total = 0 }) {
  const pct = total ? clamp((value / total) * 100, 0, 100) : 0;
  const r = 52;
  const c = 2 * Math.PI * r;
  const half = c / 2;
  const dash = (pct / 100) * half;

  return (
    <div className="relative flex h-40 items-end justify-center">
      <svg viewBox="0 0 140 80" className="h-36 w-56">
        <path
          d="M18 72a52 52 0 0 1 104 0"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M18 72a52 52 0 0 1 104 0"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${half}`}
        />
      </svg>

      <div className="absolute bottom-4 text-center">
        <div className="text-2xl font-semibold tracking-tight text-slate-900">{total || 0}</div>
        <div className="text-xs font-medium text-slate-500">All Employees</div>
      </div>
    </div>
  );
}

export default function RealtimeStatusCard({ data }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Real Time Status</div>
          <div className="mt-1 text-xs text-slate-500">Live punch summary</div>
        </div>
        <Badge variant="info">Realtime</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Punched In
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{data?.punchedIn ?? 0}</div>
        </div>
        <div className="rounded-2xl bg-rose-50 px-3 py-2 ring-1 ring-rose-100">
          <div className="flex items-center gap-2 text-xs font-medium text-rose-700">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
            Punched Out
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{data?.punchedOut ?? 0}</div>
        </div>
      </div>

      <Gauge value={data?.punchedIn ?? 0} total={data?.totalEmployees ?? 0} />
    </Card>
  );
}

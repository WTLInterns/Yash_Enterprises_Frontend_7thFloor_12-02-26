import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

export default function OffDutyEmployees({ employees = [] }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Off Duty Employees ({employees.length})</div>
          <div className="mt-1 text-xs text-slate-500">Employees currently not scheduled</div>
        </div>
        <Badge variant="default">Off Duty</Badge>
      </div>

      <div className="mt-5">
        {employees.length ? (
          <div className="space-y-3">
            {employees.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <Avatar name={e.name} className="h-9 w-9" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{e.name}</div>
                    <div className="truncate text-xs text-slate-500">{e.teamName || "-"}</div>
                  </div>
                </div>
                <Badge variant="warning">OFF</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <div className="text-sm font-semibold text-slate-900">No Data found</div>
            <div className="mt-1 text-xs text-slate-500">Off-duty employees will show here when available.</div>
          </div>
        )}
      </div>
    </Card>
  );
}

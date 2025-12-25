import Card from "@/components/ui/Card";

export default function StaffingStrengthCard({ staffingStrength }) {
  const present = staffingStrength?.present ?? 0;
  const required = staffingStrength?.required ?? 0;

  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-slate-900">Staffing Strength</div>
      <div className="mt-1 text-xs text-slate-500">Required ratio for current shift</div>

      <div className="mt-6 flex items-baseline justify-center gap-2">
        <div className="text-4xl font-semibold tracking-tight text-slate-900">{present}</div>
        <div className="text-lg font-semibold text-slate-400">/</div>
        <div className="text-3xl font-semibold tracking-tight text-slate-700">{required}</div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <div className="text-xs font-medium text-slate-600">Recommendation</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">
          Maintain staffing strength to reduce overtime and improve compliance.
        </div>
      </div>
    </Card>
  );
}

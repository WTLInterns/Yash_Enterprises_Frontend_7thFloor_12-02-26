"use client";

import DynamicFieldInput from "@/components/dynamic-fields/DynamicFieldInput";

export default function DynamicFieldsSection({
  title = "Custom Fields",
  definitions = [],
  values = {},
  onChange,
}) {
  const activeDefs = (definitions || []).filter((d) => d?.active !== false);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        {/* <div>
          <h3 className="text-sm font-medium text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">Fields are configured by Admin and rendered dynamically.</p>
        </div> */}
      </div>

      {activeDefs.length === 0 ? (
        <div className="mt-4 text-center py-6 text-sm text-slate-500 border-2 border-dashed border-slate-300 rounded-lg">
          No custom fields configured.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activeDefs.map((def) => {
            const type = String(def.fieldType || "TEXT").toUpperCase();
            const key = def.fieldKey;
            const v = values?.[key] ?? "";

            return (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-4">
                {type !== "BOOLEAN" && (
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {def.fieldName || def.fieldKey}
                    {def.required ? <span className="text-rose-500"> *</span> : null}
                  </label>
                )}

                <DynamicFieldInput
                  def={def}
                  value={v}
                  onChange={(next) => onChange?.(key, next)}
                />

                {def.required && (v == null || String(v).trim() === "") ? (
                  <div className="mt-2 text-xs text-rose-600">Required</div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

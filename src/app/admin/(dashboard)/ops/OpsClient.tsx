"use client";

type Row = Record<string, unknown>;

export function OpsClient({
  initialQueue,
  initialAudits,
  errors = [],
}: {
  initialQueue: Row[];
  initialAudits: Row[];
  errors?: string[];
}) {
  return (
    <div className="space-y-4">
      {errors.length > 0 ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Some ops data could not be loaded</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-red-700">
            This is an error, not an empty queue. Check RLS/admin session and retry.
          </p>
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-bold">Automation queue</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {initialQueue.length === 0 ? (
            <li className="text-slate-500">No queue rows</li>
          ) : (
            initialQueue.map((r) => (
              <li key={String(r.id)} className="border-b border-slate-100 pb-2">
                <span className="font-semibold">{String(r.status)}</span> · {String(r.event_type)} ·
                attempts {String(r.attempts ?? 0)}
                {r.last_error ? (
                  <p className="text-xs text-red-700">{String(r.last_error)}</p>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-bold">Audit events</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {initialAudits.length === 0 ? (
            <li className="text-slate-500">No audit rows</li>
          ) : (
            initialAudits.map((r) => (
              <li key={String(r.id)} className="border-b border-slate-100 pb-2">
                {String(r.action)} · {String(r.entity_type)}
                {r.entity_id ? ` · ${String(r.entity_id)}` : ""}
              </li>
            ))
          )}
        </ul>
      </section>
      </div>
    </div>
  );
}

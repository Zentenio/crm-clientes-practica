"use client";

import { Cliente, Etapa, ETAPAS } from "@/lib/types";
import { formatoMoneda } from "@/lib/utils";

interface Props {
  clientes: Cliente[];
}

const ACCENT: Record<Etapa, { bar: string; iconBg: string; iconColor: string }> = {
  prospecto: { bar: "bg-dot-blue", iconBg: "bg-dot-blue-soft", iconColor: "text-dot-blue" },
  propuesta: { bar: "bg-dot-orange", iconBg: "bg-dot-orange-soft", iconColor: "text-dot-orange" },
  activo: { bar: "bg-dot-green", iconBg: "bg-dot-green-soft", iconColor: "text-dot-green" },
  cerrado: { bar: "bg-dot-red", iconBg: "bg-dot-red-soft", iconColor: "text-dot-red" },
};

function StageIcon({ etapa }: { etapa: Etapa }) {
  const common = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (etapa === "prospecto") return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
  if (etapa === "propuesta") return <svg {...common}><path d="M4 4h13l3 3v13H4z" /><path d="M8 9h9M8 13h9M8 17h5" /></svg>;
  if (etapa === "activo") return <svg {...common}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>;
  return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
}

export default function SummaryPanel({ clientes }: Props) {
  const porResponsable = Array.from(
    clientes.reduce((acc, c) => {
      if (!c.responsable) return acc;
      acc.set(c.responsable, (acc.get(c.responsable) ?? 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ETAPAS.map((etapa) => {
          const enEtapa = clientes.filter((c) => c.etapa === etapa.id);
          const total = enEtapa.reduce((acc, c) => acc + c.monto, 0);
          const accent = ACCENT[etapa.id];
          return (
            <div
              key={etapa.id}
              className="relative overflow-hidden rounded-card border border-divider bg-card shadow-card p-3.5"
            >
              <span className={`absolute top-0 left-0 right-0 h-[3px] ${accent.bar}`} />
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center justify-center h-6 w-6 rounded-full ${accent.iconBg} ${accent.iconColor} shrink-0`}>
                  <StageIcon etapa={etapa.id} />
                </span>
                <p className="text-xs text-muted truncate">{etapa.titulo}</p>
              </div>
              <p className="text-2xl font-semibold text-ink tracking-tight leading-none">{enEtapa.length}</p>
              <p className="text-xs text-caption mt-1.5">{formatoMoneda(total)}</p>
            </div>
          );
        })}
      </div>

      {porResponsable.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-muted">Por responsable:</span>
          {porResponsable.map(([nombre, cantidad]) => (
            <span
              key={nombre}
              className="inline-flex items-center gap-1 rounded-pill bg-fog text-caption text-xs px-2.5 py-1"
            >
              {nombre}
              <span className="font-semibold text-ink">{cantidad}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { Cliente, ETAPAS } from "@/lib/types";
import { formatoMoneda } from "@/lib/utils";

interface Props {
  clientes: Cliente[];
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
          return (
            <div key={etapa.id} className="rounded-card bg-card shadow-card p-3">
              <p className="text-xs text-muted">{etapa.titulo}</p>
              <p className="text-lg font-semibold text-ink">{enEtapa.length}</p>
              <p className="text-xs text-caption">{formatoMoneda(total)}</p>
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

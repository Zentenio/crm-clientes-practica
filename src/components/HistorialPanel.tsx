"use client";

import { Cliente } from "@/lib/types";
import { formatoFecha, formatoMoneda } from "@/lib/utils";

interface Props {
  clientes: Cliente[];
}

export default function HistorialPanel({ clientes }: Props) {
  const ordenados = [...clientes].sort((a, b) =>
    b.fechaUltimoContacto.localeCompare(a.fechaUltimoContacto)
  );

  return (
    <div className="rounded-column bg-wash shadow-column p-3">
      <h2 className="text-sm font-semibold text-ink mb-2">
        Historial de clientes ({ordenados.length})
      </h2>
      {ordenados.length === 0 ? (
        <p className="text-xs text-muted">Todavía no hay clientes cerrados.</p>
      ) : (
        <div className="space-y-2">
          {ordenados.map((c) => (
            <div key={c.id} className="rounded-card bg-card shadow-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-body text-sm">{c.nombre}</span>
                  <span className="text-xs text-muted ml-2">{c.etiqueta}</span>
                </div>
                {c.resultado === "ganado" && (
                  <span className="shrink-0 inline-flex items-center rounded-pill bg-dot-green-soft text-dot-green text-xs px-2 py-0.5">
                    Ganado
                  </span>
                )}
                {c.resultado === "perdido" && (
                  <span className="shrink-0 inline-flex items-center rounded-pill bg-dot-red-soft text-dot-red text-xs px-2 py-0.5">
                    Perdido
                  </span>
                )}
                {!c.resultado && (
                  <span className="shrink-0 inline-flex items-center rounded-pill bg-fog text-muted text-xs px-2 py-0.5">
                    Sin resultado
                  </span>
                )}
              </div>
              <p className="text-xs text-body mt-1">{c.notaCierre || "Sin detalle registrado."}</p>
              <div className="flex items-center justify-between mt-2 text-[11px] text-muted">
                <span>{c.responsable}</span>
                <span>
                  {formatoMoneda(c.monto)} · {formatoFecha(c.fechaUltimoContacto)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

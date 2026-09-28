"use client";

import { Cliente, Etapa } from "@/lib/types";
import { formatoMoneda } from "@/lib/utils";
import ClientCard from "./ClientCard";

interface Props {
  etapa: Etapa;
  titulo: string;
  clientes: Cliente[];
  onCardClick: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (etapa: Etapa, e: React.DragEvent) => void;
}

const DOT_COLOR: Record<Etapa, string> = {
  prospecto: "bg-dot-blue",
  propuesta: "bg-dot-orange",
  activo: "bg-dot-green",
  cerrado: "bg-dot-red",
};

export default function KanbanColumn({ etapa, titulo, clientes, onCardClick, onDragStart, onDrop }: Props) {
  const totalMonto = clientes.reduce((acc, c) => acc + c.monto, 0);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(etapa, e)}
      className="flex-1 min-w-[240px] bg-wash border border-divider rounded-column p-3 flex flex-col"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${DOT_COLOR[etapa]}`} />
        <h3 className="text-sm font-semibold text-ink flex-1 truncate">{titulo}</h3>
        <span className="text-[11px] font-medium text-caption bg-card border border-divider rounded-pill px-2 py-0.5 shrink-0">
          {clientes.length}
        </span>
      </div>
      <p className="text-xs text-muted mb-2 -mt-1.5">{formatoMoneda(totalMonto)}</p>
      <div className="flex-1 overflow-y-auto">
        {clientes.map((c) => (
          <ClientCard
            key={c.id}
            cliente={c}
            onClick={() => onCardClick(c.id)}
            onDragStart={onDragStart}
          />
        ))}
        {clientes.length === 0 && (
          <p className="text-xs text-muted text-center mt-6">Sin clientes en esta etapa</p>
        )}
      </div>
    </div>
  );
}

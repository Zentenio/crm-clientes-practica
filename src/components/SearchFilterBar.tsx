"use client";

interface Props {
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  etiquetaSeleccionada: string;
  etiquetas: string[];
  onEtiquetaChange: (v: string) => void;
  responsableSeleccionado: string;
  responsables: string[];
  onResponsableChange: (v: string) => void;
  onNuevoCliente: () => void;
  onExportar: () => void;
  onImportarClick: () => void;
  onEmpezarDeCero: () => void;
}

export default function SearchFilterBar({
  busqueda,
  onBusquedaChange,
  etiquetaSeleccionada,
  etiquetas,
  onEtiquetaChange,
  responsableSeleccionado,
  responsables,
  onResponsableChange,
  onNuevoCliente,
  onExportar,
  onImportarClick,
  onEmpezarDeCero,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
        className="rounded-input border border-divider bg-card px-3 py-1.5 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-focus"
      />
      <select
        value={etiquetaSeleccionada}
        onChange={(e) => onEtiquetaChange(e.target.value)}
        className="rounded-input border border-divider bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
      >
        <option value="">Todos los rubros</option>
        {etiquetas.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      <select
        value={responsableSeleccionado}
        onChange={(e) => onResponsableChange(e.target.value)}
        className="rounded-input border border-divider bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
      >
        <option value="">Todos los responsables</option>
        {responsables.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button
        onClick={onNuevoCliente}
        className="rounded-pill bg-accent text-white text-sm font-medium px-4 py-1.5 hover:bg-accent-hover transition-colors"
      >
        Nuevo cliente
      </button>
      <button
        onClick={onExportar}
        className="rounded-pill border border-accent text-accent bg-card text-sm font-medium px-4 py-1.5 hover:bg-wash transition-colors"
      >
        Exportar JSON
      </button>
      <button
        onClick={onImportarClick}
        className="rounded-pill border border-accent text-accent bg-card text-sm font-medium px-4 py-1.5 hover:bg-wash transition-colors"
      >
        Importar JSON
      </button>
      <button
        onClick={onEmpezarDeCero}
        className="rounded-pill border border-dot-red text-dot-red bg-card text-sm font-medium px-4 py-1.5 hover:bg-dot-red-soft transition-colors"
      >
        Empezar de cero
      </button>
    </div>
  );
}

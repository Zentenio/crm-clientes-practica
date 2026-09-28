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

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V9M7 14l5-5 5 5M4 3h16" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
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
    <div className="rounded-card border border-divider bg-card shadow-card px-3.5 py-3 mb-4 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-input border border-divider bg-canvas px-3 py-1.5 flex-1 min-w-[180px] focus-within:ring-2 focus-within:ring-focus focus-within:border-transparent transition-shadow">
        <span className="text-muted shrink-0">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="bg-transparent text-sm w-full outline-none placeholder:text-muted"
        />
      </div>

      <select
        value={etiquetaSeleccionada}
        onChange={(e) => onEtiquetaChange(e.target.value)}
        className="rounded-input border border-divider bg-canvas px-2 py-1.5 text-sm text-caption focus:outline-none focus:ring-2 focus:ring-focus"
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
        className="rounded-input border border-divider bg-canvas px-2 py-1.5 text-sm text-caption focus:outline-none focus:ring-2 focus:ring-focus"
      >
        <option value="">Todos los responsables</option>
        {responsables.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <span className="w-px self-stretch bg-divider mx-1 hidden sm:block" />

      <button
        onClick={onImportarClick}
        title="Importar JSON"
        className="inline-flex items-center gap-1.5 rounded-pill border border-divider text-caption bg-card text-sm font-medium px-3 py-1.5 hover:bg-fog transition-colors"
      >
        <IconUpload />
        Importar
      </button>
      <button
        onClick={onExportar}
        title="Exportar JSON"
        className="inline-flex items-center gap-1.5 rounded-pill border border-divider text-caption bg-card text-sm font-medium px-3 py-1.5 hover:bg-fog transition-colors"
      >
        <IconDownload />
        Exportar
      </button>
      <button
        onClick={onNuevoCliente}
        className="inline-flex items-center gap-1.5 rounded-pill bg-accent text-white text-sm font-medium px-4 py-1.5 shadow-[0_2px_8px_-2px_rgba(20,90,255,0.5)] hover:bg-accent-hover transition-colors"
      >
        <IconPlus />
        Nuevo cliente
      </button>

      <button
        onClick={onEmpezarDeCero}
        className="text-xs text-muted hover:text-dot-red transition-colors ml-auto px-1"
      >
        Empezar de cero
      </button>
    </div>
  );
}

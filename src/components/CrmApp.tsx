"use client";

import { useMemo, useRef, useState } from "react";
import { Cliente, Etapa, ETAPAS } from "@/lib/types";
import { crearClientesDeEjemplo } from "@/lib/seedData";
import { exportarClientes, parsearImportacion } from "@/lib/utils";
import KanbanColumn from "@/components/KanbanColumn";
import SummaryPanel from "@/components/SummaryPanel";
import SearchFilterBar from "@/components/SearchFilterBar";
import ClientModal from "@/components/ClientModal";
import HistorialPanel from "@/components/HistorialPanel";

export default function CrmApp() {
  const [clientes, setClientes] = useState<Cliente[]>(() => crearClientesDeEjemplo());
  const [busqueda, setBusqueda] = useState("");
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState("");
  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");
  const [clienteEnEdicion, setClienteEnEdicion] = useState<Cliente | null | undefined>(undefined);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const inputImportarRef = useRef<HTMLInputElement>(null);

  const etiquetas = useMemo(
    () => Array.from(new Set(clientes.map((c) => c.etiqueta).filter(Boolean))),
    [clientes]
  );

  const responsables = useMemo(
    () => Array.from(new Set(clientes.map((c) => c.responsable).filter(Boolean))).sort(),
    [clientes]
  );

  const clientesHistorial = useMemo(
    () => clientes.filter((c) => c.etapa === "cerrado"),
    [clientes]
  );

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      const coincideBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEtiqueta = !etiquetaSeleccionada || c.etiqueta === etiquetaSeleccionada;
      const coincideResponsable = !responsableSeleccionado || c.responsable === responsableSeleccionado;
      return coincideBusqueda && coincideEtiqueta && coincideResponsable;
    });
  }, [clientes, busqueda, etiquetaSeleccionada, responsableSeleccionado]);

  function moverCliente(id: string, etapa: Etapa) {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, etapa } : c)));
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDrop(etapa: Etapa, e: React.DragEvent) {
    const id = e.dataTransfer.getData("text/plain");
    if (id) moverCliente(id, etapa);
  }

  function guardarCliente(cliente: Cliente) {
    setClientes((prev) => {
      const existe = prev.some((c) => c.id === cliente.id);
      if (existe) return prev.map((c) => (c.id === cliente.id ? cliente : c));
      return [...prev, cliente];
    });
    setClienteEnEdicion(undefined);
  }

  function eliminarCliente(id: string) {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    setClienteEnEdicion(undefined);
  }

  function empezarDeCero() {
    const confirmado = window.confirm(
      "¿Seguro que querés borrar todos los clientes? Esta acción no se puede deshacer."
    );
    if (confirmado) setClientes([]);
  }

  function importar(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const nuevos = parsearImportacion(String(lector.result));
        setClientes(nuevos);
      } catch {
        window.alert("No se pudo leer el archivo. Verificá que sea un JSON exportado desde esta app.");
      }
    };
    lector.readAsText(archivo);
    e.target.value = "";
  }

  return (
    <main className="min-h-screen bg-canvas p-4 sm:p-6">
      <div className="mx-auto max-w-[1400px]">
      <header className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/zentenio-wordmark.png" alt="Zentenio" className="h-7 w-auto shrink-0" />
          <span className="h-6 w-px bg-divider-strong shrink-0" />
          <div>
            <h1 className="text-[19px] leading-[1.3] tracking-[-0.2px] font-bold text-ink">CRM de clientes</h1>
            <p className="text-sm text-muted">Seguimiento de clientes y proyectos de datos e IA, de punta a punta.</p>
          </div>
        </div>
      </header>

      <SummaryPanel clientes={clientes} />

      <SearchFilterBar
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        etiquetaSeleccionada={etiquetaSeleccionada}
        etiquetas={etiquetas}
        onEtiquetaChange={setEtiquetaSeleccionada}
        responsableSeleccionado={responsableSeleccionado}
        responsables={responsables}
        onResponsableChange={setResponsableSeleccionado}
        onNuevoCliente={() => setClienteEnEdicion(null)}
        onExportar={() => exportarClientes(clientes)}
        onImportarClick={() => inputImportarRef.current?.click()}
        onEmpezarDeCero={empezarDeCero}
      />
      <input
        ref={inputImportarRef}
        type="file"
        accept="application/json"
        onChange={importar}
        className="hidden"
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {ETAPAS.map((etapa) => (
          <KanbanColumn
            key={etapa.id}
            etapa={etapa.id}
            titulo={etapa.titulo}
            clientes={clientesFiltrados.filter((c) => c.etapa === etapa.id)}
            onCardClick={(id) => setClienteEnEdicion(clientes.find((c) => c.id === id) ?? null)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setMostrarHistorial((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${mostrarHistorial ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          {mostrarHistorial ? "Ocultar historial de clientes" : "Ver historial de clientes"}
        </button>
        {mostrarHistorial && <HistorialPanel clientes={clientesHistorial} />}
      </div>

      {clienteEnEdicion !== undefined && (
        <ClientModal
          cliente={clienteEnEdicion}
          onClose={() => setClienteEnEdicion(undefined)}
          onGuardar={guardarCliente}
          onEliminar={eliminarCliente}
        />
      )}

      <footer className="mt-6 text-center">
        <p className="text-xs text-muted">
          Los datos viven solo en esta sesión del navegador. Usá &quot;Exportar JSON&quot; para guardarlos.
        </p>
      </footer>
      </div>
    </main>
  );
}

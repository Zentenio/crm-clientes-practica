"use client";

import { useMemo, useRef, useState } from "react";
import { Cliente, Etapa, ETAPAS } from "@/lib/types";
import { crearClientesDeEjemplo } from "@/lib/seedData";
import { exportarClientes, parsearImportacion } from "@/lib/utils";
import KanbanColumn from "@/components/KanbanColumn";
import SummaryPanel from "@/components/SummaryPanel";
import SearchFilterBar from "@/components/SearchFilterBar";
import ClientModal from "@/components/ClientModal";

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>(() => crearClientesDeEjemplo());
  const [busqueda, setBusqueda] = useState("");
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState("");
  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");
  const [clienteEnEdicion, setClienteEnEdicion] = useState<Cliente | null | undefined>(undefined);
  const inputImportarRef = useRef<HTMLInputElement>(null);

  const etiquetas = useMemo(
    () => Array.from(new Set(clientes.map((c) => c.etiqueta).filter(Boolean))),
    [clientes]
  );

  const responsables = useMemo(
    () => Array.from(new Set(clientes.map((c) => c.responsable).filter(Boolean))).sort(),
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
      <header className="mb-4">
        <h1 className="text-[22px] leading-[1.4] tracking-[-0.2px] font-semibold text-ink">CRM de clientes — Zentenio</h1>
        <p className="text-sm text-muted">Seguimiento de clientes y proyectos de datos e IA, de punta a punta.</p>
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
    </main>
  );
}

"use client";

import { useState } from "react";
import { Cliente, Etapa, ETAPAS, RESULTADOS, RUBROS, SERVICIOS } from "@/lib/types";
import { formatoFecha, nuevoId } from "@/lib/utils";

interface Props {
  cliente: Cliente | null; // null = creando uno nuevo
  onClose: () => void;
  onGuardar: (cliente: Cliente) => void;
  onEliminar: (id: string) => void;
}

const OPCION_NUEVO_RUBRO = "__nuevo_rubro__";

const vacio = (): Cliente => ({
  id: nuevoId("c"),
  nombre: "",
  servicio: "",
  monto: 0,
  etiqueta: "",
  responsable: "",
  etapa: "prospecto",
  fechaProximoContacto: new Date().toISOString().slice(0, 10),
  fechaUltimoContacto: new Date().toISOString().slice(0, 10),
  progreso: 0,
  notas: [],
});

export default function ClientModal({ cliente, onClose, onGuardar, onEliminar }: Props) {
  const [form, setForm] = useState<Cliente>(cliente ?? vacio());
  const [notaNueva, setNotaNueva] = useState("");
  const [notaEditandoId, setNotaEditandoId] = useState<string | null>(null);
  const [textoEdicionNota, setTextoEdicionNota] = useState("");

  // Si el cliente ya tenía un rubro que no está en la lista fija, arrancamos
  // mostrando el campo de texto libre directamente (para no perderlo).
  const [agregandoRubro, setAgregandoRubro] = useState(
    () => !!form.etiqueta && !(RUBROS as readonly string[]).includes(form.etiqueta)
  );
  const [rubroNuevo, setRubroNuevo] = useState(agregandoRubro ? form.etiqueta : "");

  const esNuevo = cliente === null;

  function actualizar<K extends keyof Cliente>(campo: K, valor: Cliente[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function manejarCambioRubro(valor: string) {
    if (valor === OPCION_NUEVO_RUBRO) {
      setAgregandoRubro(true);
      setRubroNuevo("");
      actualizar("etiqueta", "");
      return;
    }
    setAgregandoRubro(false);
    actualizar("etiqueta", valor);
  }

  function confirmarRubroNuevo(valor: string) {
    const limpio = valor.trim();
    setRubroNuevo(valor);
    actualizar("etiqueta", limpio);
  }

  function agregarNota() {
    if (!notaNueva.trim()) return;
    const nota = {
      id: nuevoId("n"),
      fecha: new Date().toISOString().slice(0, 10),
      texto: notaNueva.trim(),
    };
    setForm((prev) => ({ ...prev, notas: [...prev.notas, nota], fechaUltimoContacto: nota.fecha }));
    setNotaNueva("");
  }

  function empezarEdicionNota(id: string, textoActual: string) {
    setNotaEditandoId(id);
    setTextoEdicionNota(textoActual);
  }

  function guardarEdicionNota() {
    if (!notaEditandoId) return;
    const texto = textoEdicionNota.trim();
    if (!texto) {
      cancelarEdicionNota();
      return;
    }
    setForm((prev) => ({
      ...prev,
      notas: prev.notas.map((n) => (n.id === notaEditandoId ? { ...n, texto } : n)),
    }));
    setNotaEditandoId(null);
    setTextoEdicionNota("");
  }

  function cancelarEdicionNota() {
    setNotaEditandoId(null);
    setTextoEdicionNota("");
  }

  function eliminarNota(id: string) {
    setForm((prev) => ({ ...prev, notas: prev.notas.filter((n) => n.id !== id) }));
    if (notaEditandoId === id) cancelarEdicionNota();
  }

  function guardar() {
    if (!form.nombre.trim() || !form.monto) return;
    onGuardar(form);
  }

  const campoInput =
    "w-full rounded-input border border-divider bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus";
  const campoLabel = "text-xs text-muted";

  return (
    <div className="fixed inset-0 bg-[rgba(2,5,32,0.45)] flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-modal shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-divider">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-soft text-accent shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4.2" />
              </svg>
            </span>
            <h2 className="text-base font-semibold text-ink">
              {esNuevo ? "Nuevo cliente" : "Editar cliente"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex items-center justify-center h-7 w-7 rounded-full text-muted hover:text-body hover:bg-fog transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className={campoLabel}>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              className={campoInput}
            />
          </div>
          <div>
            <label className={campoLabel}>Servicio</label>
            <select
              value={form.servicio}
              onChange={(e) => actualizar("servicio", e.target.value)}
              className={campoInput}
            >
              <option value="">Seleccionar...</option>
              {SERVICIOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={campoLabel}>Monto del proyecto</label>
              <input
                type="number"
                value={form.monto}
                onChange={(e) => actualizar("monto", Number(e.target.value))}
                className={campoInput}
              />
            </div>
            <div>
              <label className={campoLabel}>Rubro</label>
              {!agregandoRubro ? (
                <select
                  value={form.etiqueta}
                  onChange={(e) => manejarCambioRubro(e.target.value)}
                  className={campoInput}
                >
                  <option value="">Seleccionar...</option>
                  {RUBROS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value={OPCION_NUEVO_RUBRO}>+ Agregar nuevo rubro...</option>
                </select>
              ) : (
                <div className="flex gap-1">
                  <input
                    autoFocus
                    value={rubroNuevo}
                    onChange={(e) => confirmarRubroNuevo(e.target.value)}
                    placeholder="Nombre del rubro"
                    className={campoInput}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAgregandoRubro(false);
                      setRubroNuevo("");
                      actualizar("etiqueta", "");
                    }}
                    className="text-xs text-muted hover:text-body px-1"
                    title="Volver a la lista"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={campoLabel}>Responsable</label>
              <input
                value={form.responsable}
                onChange={(e) => actualizar("responsable", e.target.value)}
                className={campoInput}
              />
            </div>
            <div>
              <label className={campoLabel}>Etapa</label>
              <select
                value={form.etapa}
                onChange={(e) => actualizar("etapa", e.target.value as Etapa)}
                className={campoInput}
              >
                {ETAPAS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={campoLabel}>Próximo contacto</label>
              <input
                type="date"
                value={form.fechaProximoContacto}
                onChange={(e) => actualizar("fechaProximoContacto", e.target.value)}
                className={campoInput}
              />
            </div>
            {form.etapa === "activo" && (
              <div>
                <label className={campoLabel}>Avance (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.progreso}
                  onChange={(e) => actualizar("progreso", Number(e.target.value))}
                  className={campoInput}
                />
              </div>
            )}
          </div>

          {form.etapa === "cerrado" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={campoLabel}>Resultado</label>
                <select
                  value={form.resultado ?? ""}
                  onChange={(e) =>
                    actualizar("resultado", (e.target.value || undefined) as Cliente["resultado"])
                  }
                  className={campoInput}
                >
                  <option value="">Seleccionar...</option>
                  {RESULTADOS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={campoLabel}>¿Qué pasó?</label>
                <input
                  value={form.notaCierre ?? ""}
                  onChange={(e) => actualizar("notaCierre", e.target.value)}
                  placeholder="Resumen del cierre..."
                  className={campoInput}
                />
              </div>
            </div>
          )}

          <div>
            <label className={campoLabel}>Bitácora</label>
            <div className="space-y-1 max-h-32 overflow-y-auto rounded-input border border-divider p-2 mb-2 bg-fog">
              {form.notas.length === 0 && (
                <p className="text-xs text-muted">Todavía no hay notas.</p>
              )}
              {form.notas.map((n) =>
                notaEditandoId === n.id ? (
                  <div key={n.id} className="flex gap-1 items-center">
                    <input
                      autoFocus
                      value={textoEdicionNota}
                      onChange={(e) => setTextoEdicionNota(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") guardarEdicionNota();
                        if (e.key === "Escape") cancelarEdicionNota();
                      }}
                      className="flex-1 rounded-input border border-divider bg-card px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-focus"
                    />
                    <button
                      onClick={guardarEdicionNota}
                      className="text-xs text-accent hover:underline shrink-0"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelarEdicionNota}
                      className="text-xs text-muted hover:underline shrink-0"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div key={n.id} className="flex gap-2 items-start justify-between group">
                    <p className="text-xs text-body">
                      <span className="text-muted">{formatoFecha(n.fecha)} — </span>
                      {n.texto}
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => empezarEdicionNota(n.id, n.texto)}
                        className="text-xs text-accent hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarNota(n.id)}
                        className="text-xs text-dot-red hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={notaNueva}
                onChange={(e) => setNotaNueva(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") agregarNota();
                }}
                placeholder="Agregar nota rápida..."
                className={`flex-1 ${campoInput}`}
              />
              <button
                onClick={agregarNota}
                className="rounded-pill border border-accent text-accent bg-card text-sm px-4 hover:bg-wash transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          {!esNuevo ? (
            <button
              onClick={() => onEliminar(form.id)}
              className="text-sm text-dot-red hover:underline"
            >
              Eliminar cliente
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-pill border border-divider text-body bg-card text-sm px-4 py-1.5 hover:bg-fog transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="rounded-pill bg-accent text-white text-sm font-medium px-4 py-1.5 hover:bg-accent-hover transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

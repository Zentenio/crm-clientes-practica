export type Etapa = "prospecto" | "propuesta" | "activo" | "cerrado";

export const ETAPAS: { id: Etapa; titulo: string }[] = [
  { id: "prospecto", titulo: "Prospecto" },
  { id: "propuesta", titulo: "Propuesta enviada" },
  { id: "activo", titulo: "Activo" },
  { id: "cerrado", titulo: "Cerrado" },
];

export type Resultado = "ganado" | "perdido";

export const RESULTADOS: { id: Resultado; titulo: string }[] = [
  { id: "ganado", titulo: "Ganado" },
  { id: "perdido", titulo: "Perdido" },
];

// Líneas de servicio reales de Zentenio (zentenio.com)
export const SERVICIOS = [
  "Integración y automatización de datos",
  "Calidad y seguridad de datos",
  "Dashboards e información en tiempo real",
  "Desarrollo de productos digitales",
  "Soluciones de inteligencia artificial",
] as const;

// Rubros de los clientes que atiende Zentenio
export const RUBROS = [
  "Farmacéutica",
  "Energía",
  "Logística",
  "Distribución",
  "Finanzas",
] as const;

export interface Nota {
  id: string;
  fecha: string; // ISO date
  texto: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  servicio: string;
  monto: number;
  etiqueta: string; // rubro del cliente
  responsable: string;
  etapa: Etapa;
  fechaProximoContacto: string; // ISO date
  fechaUltimoContacto: string; // ISO date
  progreso: number; // 0-100, solo aplica en etapa "activo"
  notas: Nota[];
  resultado?: Resultado; // solo aplica cuando etapa es "cerrado"
  notaCierre?: string; // que paso con el cliente al cerrar
}

export interface DatosExportados {
  version: 1;
  exportadoEl: string;
  clientes: Cliente[];
}

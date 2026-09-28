"use client";

import dynamic from "next/dynamic";

// Esta app vive 100% en memoria del navegador (estado en useState, sin
// backend). Los datos de ejemplo se generan con fechas relativas a "hoy",
// así que si Next.js pre-renderizara esta página en el servidor, el HTML
// quedaría con fechas congeladas del momento del build/request y no
// coincidiría con lo que calcula el cliente al hidratar, generando el
// clásico error de hidratación. Como no necesitamos SEO ni SSR acá,
// cargamos el componente solo en el cliente (ssr: false) para eliminar
// el problema de raíz.
const CrmApp = dynamic(() => import("@/components/CrmApp"), { ssr: false });

export default function Page() {
  return <CrmApp />;
}

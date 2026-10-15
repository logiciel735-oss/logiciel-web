import { Fragment, useState } from "react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import Loader from "../../../shared/components/Loader";
import SectionHeader from "../../../shared/ui/SectionHeader";
import { ROLE_LABELS } from "../../auth/model/permissions";
import { AUDIT_PAGE_SIZE } from "../api/auditApi";
import { useAuditoria } from "../model/useAuditoria";

const TABLAS = {
  noticias: "Noticias",
  eventos: "Eventos",
  proyectos: "Proyectos",
  publicaciones_cientificas: "Publicaciones",
  lineas_investigacion: "Líneas de investigación",
  semilleros: "Semilleros",
  aliados_institucionales: "Aliados",
  miembros: "Miembros",
  users: "Usuarios",
};

const ACCIONES = {
  INSERT: { label: "Creó", className: "bg-emerald-50 text-emerald-700" },
  UPDATE: { label: "Editó", className: "bg-amber-50 text-amber-700" },
  DELETE: { label: "Eliminó", className: "bg-red-50 text-red-700" },
};

const formatFecha = (value) =>
  new Date(value).toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatValor = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
};

const AccionBadge = ({ accion }) => {
  const a = ACCIONES[accion] || { label: accion, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.className}`}>
      {a.label}
    </span>
  );
};

const Usuario = ({ row }) => (
  <div className="min-w-0">
    <p className="truncate font-medium text-brand-navy">{row.usuario_email || "—"}</p>
    {row.usuario_rol && (
      <p className="text-xs text-slate-500">{ROLE_LABELS[row.usuario_rol] || row.usuario_rol}</p>
    )}
  </div>
);

// Detalle de un registro: campos cambiados (UPDATE) o datos creados/eliminados
const Cambios = ({ row }) => {
  if (row.accion === "UPDATE") {
    const campos = Object.keys(row.despues || {});
    return (
      <dl className="space-y-2">
        {campos.map((campo) => (
          <div key={campo} className="grid gap-1 sm:grid-cols-[160px_1fr]">
            <dt className="font-mono text-xs font-semibold text-slate-500">{campo}</dt>
            <dd className="break-words text-sm">
              <span className="text-red-600 line-through decoration-red-300">{formatValor(row.antes?.[campo])}</span>
              <span className="mx-2 text-slate-400">→</span>
              <span className="text-emerald-700">{formatValor(row.despues?.[campo])}</span>
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  const datos = row.accion === "DELETE" ? row.antes : row.despues;
  return (
    <dl className="space-y-1.5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {row.accion === "DELETE" ? "Datos eliminados" : "Datos creados"}
      </p>
      {Object.entries(datos || {}).map(([campo, valor]) => (
        <div key={campo} className="grid gap-1 sm:grid-cols-[160px_1fr]">
          <dt className="font-mono text-xs font-semibold text-slate-500">{campo}</dt>
          <dd className="break-words text-sm text-slate-700">{formatValor(valor)}</dd>
        </div>
      ))}
    </dl>
  );
};

export default function AuditLog() {
  const {
    rows, total, page, setPage, filtros, aplicarFiltro, limpiarFiltros, loading, error, refresh,
  } = useAuditoria();

  const [abierto, setAbierto] = useState(null);
  const [busqueda, setBusqueda] = useState(filtros.usuario);

  const totalPaginas = Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE));
  const desde = total === 0 ? 0 : page * AUDIT_PAGE_SIZE + 1;
  const hasta = Math.min(total, (page + 1) * AUDIT_PAGE_SIZE);
  const hayFiltros = filtros.tabla || filtros.accion || filtros.usuario;

  const toggle = (id) => setAbierto((prev) => (prev === id ? null : id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Administración"
        title="Auditoría"
        description="Lo que crean, editan o eliminan los editores y administradores: contenido, miembros y gestión de usuarios."
        action={
          <button onClick={refresh} className="btn-secondary py-2 text-sm">
            <ArrowPathIcon className="h-4 w-4" />
            Actualizar
          </button>
        }
      />

      {/* FILTROS */}
      <div className="card mb-6 grid gap-3 p-4 hover:shadow-sm sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]">
        <select
          className="input-base text-sm"
          value={filtros.tabla}
          onChange={(e) => aplicarFiltro("tabla", e.target.value)}
          aria-label="Filtrar por sección"
        >
          <option value="">Todas las secciones</option>
          {Object.entries(TABLAS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          className="input-base text-sm"
          value={filtros.accion}
          onChange={(e) => aplicarFiltro("accion", e.target.value)}
          aria-label="Filtrar por acción"
        >
          <option value="">Todas las acciones</option>
          {Object.entries(ACCIONES).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            aplicarFiltro("usuario", busqueda);
          }}
        >
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pl-9 text-sm"
            placeholder="Buscar por correo del usuario y pulsa Enter"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onBlur={() => busqueda !== filtros.usuario && aplicarFiltro("usuario", busqueda)}
          />
        </form>

        <button
          onClick={() => {
            setBusqueda("");
            limpiarFiltros();
          }}
          disabled={!hayFiltros}
          className="btn-secondary py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      {/* LISTA */}
      <div className="card relative min-h-[240px] overflow-hidden hover:shadow-sm">
        {loading && <Loader text="Cargando auditoría…" />}

        {error && !loading && (
          <p className="py-16 text-center text-red-600">{error}</p>
        )}

        {!error && !loading && rows.length === 0 && (
          <p className="py-16 text-center text-slate-500">
            {hayFiltros ? "No hay registros con esos filtros." : "Todavía no hay registros de auditoría."}
          </p>
        )}

        {!error && rows.length > 0 && (
          <>
            {/* ESCRITORIO */}
            <table className="hidden w-full text-sm md:table">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Usuario</th>
                  <th className="px-5 py-3 font-semibold">Acción</th>
                  <th className="px-5 py-3 font-semibold">Sección</th>
                  <th className="px-5 py-3 font-semibold">Registro</th>
                  <th className="px-5 py-3 text-right font-semibold">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="transition-colors hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatFecha(row.created_at)}</td>
                      <td className="max-w-[220px] px-5 py-3"><Usuario row={row} /></td>
                      <td className="px-5 py-3"><AccionBadge accion={row.accion} /></td>
                      <td className="px-5 py-3 text-slate-600">{TABLAS[row.tabla] || row.tabla}</td>
                      <td className="max-w-[260px] truncate px-5 py-3 text-slate-700">{row.descripcion || "—"}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => toggle(row.id)}
                          aria-expanded={abierto === row.id}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-teal hover:text-brand-teal"
                        >
                          {row.accion === "UPDATE" ? "Ver cambios" : "Ver datos"}
                          <ChevronDownIcon className={`h-3.5 w-3.5 transition ${abierto === row.id ? "rotate-180" : ""}`} />
                        </button>
                      </td>
                    </tr>
                    {abierto === row.id && (
                      <tr className="bg-slate-50">
                        <td colSpan={6} className="px-5 py-4"><Cambios row={row} /></td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>

            {/* MÓVIL */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {rows.map((row) => (
                <li key={row.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Usuario row={row} />
                    <AccionBadge accion={row.accion} />
                  </div>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{TABLAS[row.tabla] || row.tabla}</span>
                    {row.descripcion && <> · {row.descripcion}</>}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{formatFecha(row.created_at)}</span>
                    <button
                      onClick={() => toggle(row.id)}
                      className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark"
                    >
                      {abierto === row.id ? "Ocultar" : row.accion === "UPDATE" ? "Ver cambios" : "Ver datos"}
                    </button>
                  </div>
                  {abierto === row.id && (
                    <div className="rounded-lg bg-slate-50 p-3"><Cambios row={row} /></div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* PAGINACIÓN */}
      {total > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
          <p>Mostrando {desde}–{hasta} de {total} registros</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0 || loading}
              className="btn-secondary py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="self-center px-2">Página {page + 1} de {totalPaginas}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPaginas || loading}
              className="btn-secondary py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

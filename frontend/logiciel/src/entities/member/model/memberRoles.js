// Cargos de un miembro dentro del grupo (no confundir con el rol de la plataforma: user/editor/admin).
// El orden de la lista es el orden en que aparecen en la sección Miembros.
//   badge → etiqueta sobre fondo claro (tarjetas)
//   solid → etiqueta sobre fondo oscuro (cabecera del perfil)
export const MEMBER_ROLES = [
  {
    value: "director",
    label: "Director",
    badge: "bg-brand-navy text-white",
    solid: "bg-white text-brand-navy",
  },
  {
    value: "investigador",
    label: "Investigador",
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
    solid: "bg-indigo-500 text-white",
  },
  {
    value: "docente",
    label: "Docente",
    badge: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    solid: "bg-amber-500 text-white",
  },
  {
    value: "estudiante",
    label: "Estudiante",
    badge: "bg-brand-teal-light text-brand-teal-dark ring-1 ring-inset ring-brand-teal/20",
    solid: "bg-brand-teal text-white",
  },
];

// Cargos antiguos que ya no se ofrecen (p. ej. coordinador): se muestran en gris
const FALLBACK = {
  badge: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  solid: "bg-slate-500 text-white",
};

const normalizeRole = (role) => String(role || "").toLowerCase().trim();

export const getMemberRole = (role) => {
  const found = MEMBER_ROLES.find((r) => r.value === normalizeRole(role));
  return found || { value: normalizeRole(role), label: role || "", ...FALLBACK };
};

const rank = (role) => {
  const i = MEMBER_ROLES.findIndex((r) => r.value === normalizeRole(role));
  return i === -1 ? MEMBER_ROLES.length : i; // cargos desconocidos o vacíos, al final
};

// Por cargo y, dentro de cada cargo, por nombre (sin modificar la lista original)
export const sortMiembros = (miembros = []) =>
  [...miembros].sort(
    (a, b) =>
      rank(a.role) - rank(b.role) ||
      (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" })
  );

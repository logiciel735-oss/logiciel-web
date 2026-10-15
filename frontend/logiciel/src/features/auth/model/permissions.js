// Roles de la plataforma y permisos derivados (la seguridad real la imponen las políticas RLS)
export const ROLES = {
  USER: "user",
  EDITOR: "editor",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  user: "Usuario",
  editor: "Editor",
  admin: "Administrador",
};

// Gestionar usuarios, cambiar roles y ver la auditoría
export const esAdmin = (user) => user?.role === ROLES.ADMIN;

// Crear, editar y eliminar contenido y miembros
export const puedeEditarContenido = (user) =>
  user?.role === ROLES.ADMIN || user?.role === ROLES.EDITOR;

# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio. La documentación para personas está en [README.md](README.md).

## Proyecto

CMS del grupo de investigación **LOGICIEL** (Fundación Universitaria de Popayán). Sitio público + panel
de administración para noticias, eventos, proyectos, publicaciones, líneas, semilleros, aliados y miembros.

- **Producción:** https://logiciel-web.vercel.app (despliegue automático con cada push a `main` del remoto `logiciel`).
- **Stack:** React 19 + Vite 7 + Tailwind 3 · Supabase (PostgreSQL, Auth, RLS, Edge Functions) · Cloudinary · Resend · Vercel.
- **Sin backend propio:** el frontend llama a Supabase directamente; la seguridad la imponen las políticas RLS.
- La interfaz y los textos están en **español**; mantener ese idioma en UI, mensajes, comentarios y commits.

## Comandos

Todos se ejecutan en `frontend/logiciel/` con **pnpm**:

```bash
pnpm dev        # http://localhost:5173
pnpm build      # build de producción (verificar antes de cada commit)
pnpm lint       # ESLint; debe quedar sin errores
pnpm preview    # sirve dist/ (útil para capturas con Chrome headless)
```

No hay tests automatizados: validar con `pnpm lint` + `pnpm build` y, para cambios visuales, capturas.

## Arquitectura (Feature-Sliced Design)

```
frontend/logiciel/src/
  app/        rutas (publicRoutes, PrivateRoute, ProtectedRoutes role="admin")
  pages/      composición de widgets
  widgets/    bloques completos (listas, navbar, detalle, secciones del home)
  features/   acciones de usuario: auth, manage-*, adminUsers, contact, home
  entities/   entidades de negocio: api/, model/ (hooks, mappers), ui/ (tarjetas)
  shared/     config/supabase.js, firebaseEntities/, lib/, ui/, components/, uploadFile/
supabase/     SQL, plantillas de correo y Edge Function notificar-contacto
```

### Acceso a datos
- `shared/firebaseEntities/firebaseEntities.js` (**nombre heredado de Firestore; no renombrar**, lo importan muchos módulos):
  `fetchCollection`, `fetchDoc`, `insertDoc`, `updateDoc`, `deleteDoc`, `pickFields`.
- Cada API de administración define una lista blanca `FIELDS` que pasa por `pickFields` (imita los serializers
  de Django). **Si se añade una columna, agregarla a `FIELDS`** o no se guardará. Las fechas `""` se convierten en `null`.
- `shared/lib/useCMSData.js`: caché en localStorage (con TTL) para listas públicas. **No modificarlo.**
- Mappers (`entities/*/model/*Mapper.js`) traducen entre la forma de la BD y la de la UI.

### Autenticación y roles
- Supabase Auth con confirmación de correo obligatoria. Los enlaces de los correos usan `token_hash`
  (`/confirm-email?token=…`, `/reset-password?token=…`) y se validan con `verifyOtp`.
- El rol vive en `public.users.role` (`admin` / `user`). Funciones SQL: `is_admin()`, `admin_delete_user`,
  `email_registrado`; trigger `proteger_rol` impide que un usuario se cambie el rol a sí mismo.
- RLS de `users`: cada usuario lee solo su fila y los admins todas (`supabase/seguridad_usuarios.sql`).
  El perfil público de un miembro se obtiene con la RPC `perfil_publico(uid)` (`getPublicUser`), que solo
  devuelve campos publicables. No volver a abrir `users` a lectura pública.
- Nombre del usuario: columnas `nombres` y `apellidos` (registro, perfil, edición admin). La columna `name`
  la compone el trigger `componer_nombre` (`supabase/nombres_apellidos.sql`): no escribir `name` desde el frontend;
  leerla sí, es la que usa toda la UI.
- El rol solo se cambia con el botón **Promover** de la gestión de usuarios; `EditUserModal` lo muestra en solo lectura.

### Archivos y videos
- Imágenes: subida directa a Cloudinary (`/image/upload`, preset *unsigned*) vía `shared/uploadFile`.
  `validateImageFile` acepta solo JPG/PNG/WEBP/GIF de hasta 5 MB; el error para el usuario va en `err.uploadMessage`.
- Al mostrar imágenes de Cloudinary usar `optimizeImage(url, ancho)` (`shared/lib/image.js`).
- Imágenes estáticas en WebP (p. ej. `shared/assets/images/san_jose.webp`).
- Videos (noticias y proyectos): columna `videos jsonb` con **solo enlaces de YouTube o Google Drive**.
  Validación en cliente con `shared/lib/video.js` (`parseVideoUrl`) y en la BD con el check `videos_validos`
  (`supabase/videos.sql`). UI: `VideoLinksInput` (admin) y `VideoGallery` (público).

## Diseño (UI)

Estilo **institucional-moderno**, sobrio; no "tecnológico" en exceso.

- Colores (`tailwind.config.js`): `brand-navy #0C2340`, `brand-navy-light`, `brand-navy-dark`,
  `brand-teal #119DA4`, `brand-teal-dark #0D7F85`, `brand-teal-light #E6F6F7`. Fondo general `slate-50`.
- Tipografía: Inter (`font-sans`/`font-display`); Outfit (`font-brand`) solo para el wordmark "Logiciel".
- Clases base en `src/index.css`: `.btn-primary`, `.btn-secondary`, `.card`, `.input-base`, `.eyebrow`.
- Reutilizar componentes de `shared/ui/` antes de crear nuevos:
  `PageHeader` (banda navy sobre la foto del campus `san_jose.png`), `SectionHeader`, `Logo`/`LogoIcon`,
  `Modal`, `FormField`, `ImageUploadField`, `ConfirmModal`, `AdminActions`, `AuthorSelector`, `CMSDetailView`.
  Las pantallas de acceso usan `features/auth/ui/AuthLayout.jsx` + `PasswordInput.jsx`.
- `ErrorBoundary` (`shared/ui`) envuelve la app y cada ruta (en `Layout`, con `key={pathname}`).
- `Modal` **no se cierra** con clic en el fondo ni con Escape (evita perder formularios); es intencional.
- Diseño responsive: contenedores `mx-auto max-w-7xl px-4 sm:px-6`.

## Reglas al hacer cambios

- **No alterar funcionalidad** al tocar la UI: mantener nombres de funciones, props, hooks, consultas a
  Supabase, integración con Cloudinary y flujos de autenticación.
- Patrón para efectos asíncronos (cumple `react-hooks/set-state-in-effect`): función `run()` dentro del
  `useEffect` con bandera `active` y limpieza `return () => { active = false; }`.
- Los archivos mezclan finales de línea CRLF/LF: normalizar `\r\n` antes de reemplazos con regex.
- Cambios de esquema: crear un `.sql` en `supabase/`, terminar con `notify pgrst, 'reload schema';`
  y avisar al usuario que debe ejecutarlo en el SQL Editor **antes** de desplegar el código que lo usa.
- Plantillas de correo (`supabase/templates/*.html`): HTML con tablas y estilos en línea; se pegan
  manualmente en Supabase → Authentication → Emails → Templates. El logo se sirve desde `public/email/`.
- Nunca subir `.env`, claves `service_role`, API keys de Resend ni contraseñas de Gmail.
- Hacer commit/push solo cuando el usuario lo pida. Remoto de producción: `logiciel` (`git push logiciel logiciel-main:main`).

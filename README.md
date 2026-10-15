# LOGICIEL — CMS Académico

Plataforma web del grupo de investigación **LOGICIEL** (Fundación Universitaria de Popayán) para gestionar
y publicar noticias, eventos, proyectos de investigación, publicaciones científicas, líneas de investigación,
semilleros, aliados institucionales y miembros del grupo.

🌐 **Producción:** https://logiciel-web.vercel.app

**Stack:** React 19 · Vite 7 · TailwindCSS 3 · Supabase (PostgreSQL + Auth) · Cloudinary · Vercel

---

## Arquitectura

```
                 ┌──────────────────────────┐
                 │  React + Vite (Vercel)   │
                 └────────────┬─────────────┘
          ┌───────────────────┼────────────────────┐
          ▼                   ▼                    ▼
   Supabase Auth      Supabase PostgreSQL     Cloudinary
   (registro, login,  (datos + RLS)           (imágenes, upload
    recuperación)          │                    preset unsigned)
          │                │ webhook INSERT
          ▼                ▼
     SMTP Gmail     Edge Function notificar-contacto ──► Resend
```

- **No hay backend propio.** El frontend habla directamente con Supabase; la seguridad la imponen las
  políticas **RLS** de PostgreSQL (lectura pública, escritura solo para usuarios con `role = 'admin'`).
- **Correos de autenticación** (confirmación de cuenta y recuperación de contraseña) se envían por el SMTP
  de Gmail configurado en Supabase, con plantillas propias en español.
- **Formulario de contacto:** guarda el mensaje en `contacto_mensajes`; un webhook dispara la Edge Function
  que envía el aviso por Resend. Un trigger limita los envíos por correo e IP.

---

## Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | **22.12+** (o 20.19+) |
| pnpm | 9+ |

Además: cuentas de **Supabase**, **Cloudinary** y **Vercel**. El detalle de versiones está en
[`requirements.txt`](requirements.txt).

---

## Instalación local

```bash
git clone https://github.com/logiciel735-oss/logiciel-web.git
cd logiciel-web/frontend/logiciel

pnpm install
cp .env.example .env      # completar con las credenciales (ver abajo)
pnpm dev                  # http://localhost:5173
```

### Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Sirve el build localmente |
| `pnpm lint` | ESLint |

### Variables de entorno (`frontend/logiciel/.env`)

| Variable | Dónde se obtiene |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API (URL base, **sin** `/rest/v1`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary → Dashboard |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload → preset **Unsigned** |

La `anon key` es pública por diseño; la protección real está en las políticas RLS.
**Nunca** uses la `service_role` key en el frontend.

---

## Configuración de Supabase (proyecto nuevo)

Ejecutar en **SQL Editor**, en este orden:

1. [`supabase/migracion_firestore.sql`](supabase/migracion_firestore.sql) — columnas, políticas RLS,
   protección del rol, trigger de perfiles, `admin_delete_user` y límites del formulario de contacto.
2. [`supabase/recuperacion_password.sql`](supabase/recuperacion_password.sql) — función `email_registrado`.
3. [`supabase/videos.sql`](supabase/videos.sql) — columna `videos` en noticias y proyectos (solo enlaces de YouTube o Google Drive).
4. [`supabase/seguridad_usuarios.sql`](supabase/seguridad_usuarios.sql) — la tabla `users` deja de ser pública; los perfiles de miembros se leen con `perfil_publico()`.
5. [`supabase/nombres_apellidos.sql`](supabase/nombres_apellidos.sql) — columnas `nombres` y `apellidos` en `users`; `name` se compone solo.
6. [`supabase/roles_auditoria.sql`](supabase/roles_auditoria.sql) — rol `editor` (gestiona contenido y miembros) y tabla `auditoria` con el registro de cambios.
7. [`supabase/miembros_usuarios.sql`](supabase/miembros_usuarios.sql) — al eliminar un usuario se elimina también su ficha de miembro.
8. [`supabase/perfil_linkedin.sql`](supabase/perfil_linkedin.sql) — enlace de LinkedIn en el perfil y ficha de miembro sincronizada con el nombre y la foto del usuario.
9. [`supabase/auditoria_solo_equipo.sql`](supabase/auditoria_solo_equipo.sql) — la auditoría registra solo lo que hacen editores y administradores.
10. [`supabase/nombres_sin_numeros.sql`](supabase/nombres_sin_numeros.sql) — nombres, apellidos, coordinador, contacto y autores externos sin números.
11. Primer administrador (después de registrarse en la web):
   ```sql
   update public.users set role = 'admin' where email = 'correo@ejemplo.com';
   ```

En el panel:

| Sección | Configuración |
|---|---|
| Authentication → URL Configuration | **Site URL:** `https://logiciel-web.vercel.app` · **Redirect URLs:** la de producción y `http://localhost:5173/**` |
| Authentication → Sign In / Providers | **Confirm email** activado |
| Authentication → Emails → SMTP Settings | Host `smtp.gmail.com`, puerto `465`, usuario y remitente = el Gmail del grupo, contraseña = **contraseña de aplicación** de Google |
| Authentication → Emails → Templates | *Confirm sign up* ← [`supabase/templates/confirmacion.html`](supabase/templates/confirmacion.html) · *Reset password* ← [`supabase/templates/recuperacion.html`](supabase/templates/recuperacion.html) |

### Cloudinary (upload preset)

El preset es *unsigned*, así que cualquiera que lo conozca puede subir archivos. En **Settings → Upload →
(preset) → Upload control** limitar:

| Opción | Valor |
|---|---|
| Allowed formats | `jpg, jpeg, png, webp, gif` |
| Max file size | `5000000` (5 MB) |
| Incoming transformation | `c_limit,w_2000,h_2000` |

La web también valida tipo y tamaño antes de subir, y muestra las imágenes optimizadas (`f_auto,q_auto`).

### Aviso del formulario de contacto

1. **Edge Functions → Deploy new function → Via Editor**: nombre `notificar-contacto`, código de
   [`supabase/functions/notificar-contacto/index.ts`](supabase/functions/notificar-contacto/index.ts).
   Desactivar **Enforce JWT Verification**.
2. **Edge Functions → Secrets**:

   | Secret | Valor |
   |---|---|
   | `RESEND_API_KEY` | API key de Resend |
   | `WEBHOOK_SECRET` | cadena aleatoria |
   | `CONTACT_TO` | correo que recibe los avisos |
   | `CONTACT_FROM` | *(opcional)* remitente; por defecto `onboarding@resend.dev` |

3. **Database → Webhooks**: tabla `contacto_mensajes`, evento **Insert**, tipo *Supabase Edge Function*
   → `notificar-contacto`, header `x-webhook-secret` = el mismo `WEBHOOK_SECRET`.

> Sin dominio verificado, Resend solo envía al correo dueño de la cuenta de Resend.

---

## Despliegue (Vercel)

1. Importar el repositorio en Vercel.
2. **Root Directory:** `frontend/logiciel` · Framework: **Vite**.
3. Añadir las 4 variables `VITE_*` en *Settings → Environment Variables*.
4. Cada `git push` a `main` despliega automáticamente.

`vercel.json` redirige todas las rutas a `index.html` para que funcione el enrutado del cliente.

---

## Estructura

El frontend sigue **Feature-Sliced Design**:

```
logiciel-web/
├── frontend/logiciel/
│   ├── public/email/          # recursos públicos usados por los correos
│   ├── src/
│   │   ├── app/               # punto de entrada, rutas, proveedores
│   │   ├── pages/             # páginas (composición de widgets)
│   │   ├── widgets/           # bloques de UI completos (listas, navbar, detalle…)
│   │   ├── features/          # acciones de usuario (auth, gestión admin, contacto…)
│   │   ├── entities/          # entidades de negocio: api/, model/ (hooks), ui/
│   │   └── shared/            # config de Supabase, utilidades, UI y hooks reutilizables
│   ├── .env.example
│   └── vercel.json
├── supabase/
│   ├── migracion_firestore.sql
│   ├── recuperacion_password.sql
│   ├── videos.sql
│   ├── seguridad_usuarios.sql
│   ├── nombres_apellidos.sql
│   ├── roles_auditoria.sql
│   ├── miembros_usuarios.sql
│   ├── perfil_linkedin.sql
│   ├── auditoria_solo_equipo.sql
│   ├── nombres_sin_numeros.sql
│   ├── functions/notificar-contacto/
│   └── templates/             # plantillas de correo en español
├── requirements.txt
├── CLAUDE.md              # guía para Claude Code
└── README.md
```

---

## Seguridad — archivos que nunca se suben

- `.env` (credenciales locales) — usar `.env.example` como guía.
- Claves `service_role` de Supabase, API keys de Resend o contraseñas de aplicación de Gmail.
- Cualquier archivo de credenciales (`*serviceAccount*.json`, `*firebase-credentials*.json`).

Todos están cubiertos por el [`.gitignore`](.gitignore).

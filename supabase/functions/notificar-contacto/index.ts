// Envía un correo por Resend cada vez que se inserta un mensaje en contacto_mensajes.
// Se dispara con un Database Webhook (INSERT en public.contacto_mensajes).
//
// Secrets necesarios (supabase secrets set ...):
//   RESEND_API_KEY   clave de Resend
//   WEBHOOK_SECRET   valor que el webhook envía en el header x-webhook-secret
//   CONTACT_FROM     remitente (opcional). Sin dominio verificado en Resend usa onboarding@resend.dev
//   CONTACT_TO       destinatario (opcional)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;
const CONTACT_FROM = Deno.env.get("CONTACT_FROM") ?? "LOGICIEL <onboarding@resend.dev>";
const CONTACT_TO = Deno.env.get("CONTACT_TO") ?? "munozsebastian234@gmail.com";

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("No autorizado", { status: 401 });
  }

  const { type, record } = await req.json();

  if (type !== "INSERT" || !record) {
    return new Response("Ignorado", { status: 200 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: record.email,
      subject: `[Contacto Web] ${record.subject}`,
      text:
        `Nombre: ${record.name}\n` +
        `Correo: ${record.email}\n` +
        `IP: ${record.ip ?? "desconocida"}\n\n` +
        `Mensaje:\n${record.message}`,
    }),
  });

  if (!res.ok) {
    console.error("Error enviando correo:", await res.text());
    return new Response("Error enviando correo", { status: 502 });
  }

  return new Response("OK", { status: 200 });
});

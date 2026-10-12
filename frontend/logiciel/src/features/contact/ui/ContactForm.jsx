import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const label = "mb-1.5 block text-sm font-medium text-slate-700";

export default function ContactForm({
  form,
  loading,
  feedback,
  error,
  handleChange,
  handleSubmit,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="card h-full p-8"
    >
      <h2 className="text-xl font-semibold text-brand-navy">
        Envíanos un mensaje
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Te responderemos lo antes posible.
      </p>

      {feedback && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircleIcon className="h-5 w-5 shrink-0" />
          {feedback}
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <fieldset disabled={loading} className="mt-6 grid gap-5 disabled:opacity-70 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="contact-name">Nombre completo</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-base py-2.5"
          />
        </div>

        <div>
          <label className={label} htmlFor="contact-email">Correo electrónico</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input-base py-2.5"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="contact-subject">Asunto</label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="input-base py-2.5"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="contact-message">Mensaje</label>
          <textarea
            id="contact-message"
            rows="5"
            name="message"
            value={form.message}
            onChange={handleChange}
            className="input-base py-2.5"
          />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-6 w-full py-3 sm:w-auto"
      >
        {loading && (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}

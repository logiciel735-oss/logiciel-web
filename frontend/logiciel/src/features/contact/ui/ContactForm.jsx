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
      className="flex-1 bg-[#f9f9f9] rounded-xl p-8 shadow-md"
    >
      <h3 className="text-[#0a192f] text-2xl font-bold mb-6">
        Envíanos un mensaje
      </h3>

      {feedback && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {feedback}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <fieldset disabled={loading} className="disabled:opacity-70">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre completo</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Asunto</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Mensaje</label>
        <textarea
          rows="5"
          name="message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#64ffda] text-[#0a192f] font-bold py-3 px-5 rounded-md hover:bg-[#48c9b0] transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
      >
        {loading && (
          <span className="h-5 w-5 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
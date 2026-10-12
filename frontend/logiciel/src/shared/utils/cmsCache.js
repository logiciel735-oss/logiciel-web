// TTL = tiempo máximo del cache → 15 minutos
const TTL_MS = 15 * 60 * 1000;

export const cmsCache = {
  save(key, data) {
    if (!data) return;

    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  },

  load(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const { timestamp, data } = JSON.parse(raw);

      // Expirado → ignorar
      if (Date.now() - timestamp > TTL_MS) {
        localStorage.removeItem(key);
        return null;
      }

      // Cache corrupto → ignorar
      if (!Array.isArray(data)) return null;

      return data;
    } catch {
      return null;
    }
  },

  invalidate(key) {
    localStorage.removeItem(key);
  },
};

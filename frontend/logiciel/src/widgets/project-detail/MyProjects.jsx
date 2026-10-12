const filtrarMisProyectos = (projects, userId) => {
  return projects.filter((p) =>
    (p.integrantes || []).some(
      (i) => String(i.miembro_id) === String(userId)
    )
  );
};
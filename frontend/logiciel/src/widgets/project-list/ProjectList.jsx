import { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useProjects } from "../../entities/project/model/useProjects";
import ProjectCard from "../../entities/project/ui/ProjectCard";
import ProjectFormModal from "../../features/manage-project/ui/ProjectFormModal";
import { useManageProject } from "../../features/manage-project/model/useManageProject";
import { useMiembros } from "../../entities/member/model/useMiembros";
import ProjectEditModal from "../../features/manage-project/ui/ProjectEditModal";


import { deleteProject, updateProject } from "../../features/manage-project/api/adminProjectApi";
// Nota: ajusta la ruta relativa si no usas alias (@), por ejemplo:
// import { deleteProject } from "../../../features/manage-project/api/adminProjectApi";

import ConfirmModal from "../../shared/ui/ConfirmModal";
import Loader from "../../shared/components/Loader";
import { validateDateRange } from "../../shared/lib/validators";
import { formatDateInput } from "../../shared/utils/formatDateInput";

export default function ProjectList() {

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { miembros, loading: loadingMiembros } = useMiembros();

  const normalizeAutoresProyecto = (integrantes = []) => {
    return integrantes.map((i) => {
      const miembro = miembros.find(
        (m) => String(m.user_id) === String(i.miembro_id)
      );
      return {
        nombre: i.nombre_externo || miembro?.name || "Sin nombre",
      };
    });
  };

  const {
    projects: activos,
    loading: loadingActivos,
    refresh: refreshActivos,
  } = useProjects("activo");

  const {
    projects: finalizados,
    loading: loadingFinalizados,
    refresh: refreshFinalizados,
  } = useProjects("finalizado");

  const manage = useManageProject(refreshActivos, refreshFinalizados);

  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const refreshAll = async () => {
    await refreshActivos();
    await refreshFinalizados();
  };

  const handleSave = async () => {
  const fechaInicio = formatDateInput(editData.fecha_inicio);
  const fechaFin    = formatDateInput(editData.fecha_fin);
  const dateError   = validateDateRange(fechaInicio, fechaFin);
  if (dateError) {
    toast.error(dateError);
    return;
  }

  try {
    const data = {
      titulo:          editData.titulo,
      min_descripcion: editData.min_descripcion,
      fecha_inicio:    fechaInicio,
      fecha_fin:       fechaFin,
      estado:          editData.estado || "activo", // ✅
      integrantes:     editData.integrantes,
      image:           editData.image   || "",
      gallery:         editData.gallery || [],
    };
    await updateProject(editData.id, data);
    toast.success("Proyecto actualizado");
    await refreshAll(); 
    setEditData(null);
  } catch (error) {
    console.error(error);
    toast.error("Error actualizando proyecto");
  }
};
  const handleDelete = async () => {
    try {
      await deleteProject(confirmDelete.id);
      toast.success("Proyecto eliminado");
      await refreshAll();
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Error eliminando proyecto");
    }
  };

  return (
    <>
      {/* HERO */}
      <section
        className="relative h-[45vh] sm:h-[60vh] bg-cover bg-center flex items-center justify-center text-white px-4"
        style={{ backgroundImage: "url('/assets/images/projects-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[rgba(10,25,47,0.75)]"></div>
        <div className="relative z-10 text-center flex flex-col items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-bold">
            Proyectos de Investigación
          </h1>
          {isAdmin && (
            <button
              onClick={() => manage.setOpenNew(true)}
              className="mt-6 bg-teal-300 text-[#0a192f] px-5 py-2 rounded font-semibold"
            >
              + Nuevo Proyecto
            </button>
          )}
        </div>
      </section>

      <Section
        title="Proyectos Activos"
        projects={activos}
        loading={loadingActivos || loadingMiembros}
        isAdmin={isAdmin}
        onEdit={(p) => setEditData(p)}
        onDelete={(p) => setConfirmDelete(p)}
        normalizeAutores={normalizeAutoresProyecto}
      />

      <Section
        title="Proyectos Finalizados"
        projects={finalizados}
        loading={loadingFinalizados || loadingMiembros}
        isAdmin={isAdmin}
        gray
        onEdit={(p) => setEditData(p)}
        onDelete={(p) => setConfirmDelete(p)}
        normalizeAutores={normalizeAutoresProyecto}
      />

      <ProjectFormModal
        open={manage.openNew}
        onClose={() => manage.setOpenNew(false)}
        onSubmit={manage.handleCreate}
        loading={manage.loading}
      />

      {editData && (
        <ProjectEditModal
          data={editData}
          onChange={(k, v) => setEditData((prev) => ({ ...prev, [k]: v }))}
          onSave={handleSave}
          onClose={() => setEditData(null)}
          onDelete={() => setConfirmDelete(editData)}
        />
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar proyecto"
        message={`¿Eliminar "${confirmDelete?.titulo}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}

function Section({ title, projects, loading, isAdmin, onEdit, onDelete, gray, normalizeAutores }) {
  return (
    <section className={`relative py-12 px-4 ${gray ? "bg-gray-100" : "bg-white"}`}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-[#0a192f]">
        {title}
      </h2>
      <div className="relative max-w-7xl mx-auto min-h-[200px]">
        {loading && <Loader text="Cargando proyectos..." />}
        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                baseUrl="/projects"
                isAdmin={isAdmin}
                onEdit={() => onEdit(p)}
                onDelete={() => onDelete(p)}
                normalizeAutores={normalizeAutores}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
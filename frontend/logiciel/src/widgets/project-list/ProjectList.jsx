import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../features/auth/model/useAuth";
import { useProjects } from "../../entities/project/model/useProjects";
import ProjectCard from "../../entities/project/ui/ProjectCard";
import ProjectFormModal from "../../features/manage-project/ui/ProjectFormModal";
import { useManageProject } from "../../features/manage-project/model/useManageProject";
import { useMiembros } from "../../entities/member/model/useMiembros";
import ProjectEditModal from "../../features/manage-project/ui/ProjectEditModal";
import { deleteProject, updateProject } from "../../features/manage-project/api/adminProjectApi";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import Loader from "../../shared/components/Loader";
import PageHeader from "../../shared/ui/PageHeader";
import SectionHeader from "../../shared/ui/SectionHeader";
import { PlusIcon } from "@heroicons/react/24/outline";
import { validateDateRange } from "../../shared/lib/validators";
import { formatDateInput } from "../../shared/utils/formatDateInput";
import { puedeEditarContenido } from "../../features/auth/model/permissions";

export default function ProjectList() {

  const { user } = useAuth();
  const isAdmin = puedeEditarContenido(user);

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

  // Una sola consulta; se separa por estado en el cliente
  const { projects, loading: loadingProjects, refresh: refreshAll } = useProjects();

  const activos = useMemo(
    () => projects.filter((p) => p.estado === "activo"),
    [projects]
  );
  const finalizados = useMemo(
    () => projects.filter((p) => p.estado === "finalizado"),
    [projects]
  );

  const manage = useManageProject(refreshAll, refreshAll);

  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
      videos:          editData.videos  || [],
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
      {/* ENCABEZADO */}
      <PageHeader
        eyebrow="Investigación"
        title="Proyectos de investigación"
        description="Iniciativas desarrolladas por los investigadores y semilleros del grupo."
        action={isAdmin && (
          <button
            onClick={() => manage.setOpenNew(true)}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo proyecto
          </button>
        )}
      />

      <Section
        eyebrow="En curso"
        title="Proyectos activos"
        projects={activos}
        loading={loadingProjects || loadingMiembros}
        emptyText="No hay proyectos activos por el momento."
        isAdmin={isAdmin}
        onEdit={(p) => setEditData(p)}
        onDelete={(p) => setConfirmDelete(p)}
        normalizeAutores={normalizeAutoresProyecto}
      />

      <Section
        eyebrow="Concluidos"
        title="Proyectos finalizados"
        projects={finalizados}
        loading={loadingProjects || loadingMiembros}
        emptyText="No hay proyectos finalizados por el momento."
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

function Section({ eyebrow, title, projects, loading, isAdmin, onEdit, onDelete, gray, normalizeAutores, emptyText }) {
  return (
    <section className={`relative py-14 ${gray ? "border-t border-slate-200 bg-white" : ""}`}>
      <div className="relative mx-auto min-h-[200px] max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow={eyebrow} title={title} />
        {loading && <Loader text="Cargando proyectos..." />}
        {!loading && projects.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">{emptyText}</p>
        )}
        {!loading && projects.length > 0 && (
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
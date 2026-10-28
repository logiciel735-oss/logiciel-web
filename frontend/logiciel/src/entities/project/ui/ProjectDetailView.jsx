import CMSDetailView from "../../../shared/ui/CMSDetailView";
import { updateProject, deleteProject } from "../../../features/manage-project/api/adminProjectApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../../../shared/ui/ConfirmModal";
import toast from "react-hot-toast";

export default function ProjectDetailView({ project, loading, refresh, isAdmin }) {
  const navigate  = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]           = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteProject(project?.id);
      toast.success("Proyecto eliminado");
      navigate("/projects");
    } catch {
      toast.error("Error eliminando proyecto");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const item = project ? {
    id:          project.id,
    title:       project.titulo,
    content:     project.descripcion,
    description: project.objetivos
      ? (Array.isArray(project.objetivos)
          ? project.objetivos.join("\n")
          : project.objetivos)
      : "",
    image:   project.image || "",      
    gallery: project.gallery || [],
    videos:  project.videos  || [],
    autores: (project.integrantes || []).map((i) => ({
      miembro_id:     i.miembro_id     || "",
      nombre_externo: i.nombre_externo || "",
      rol:            i.rol            || "Integrante",
    })),
  } : null;

  return (
    <>
      <CMSDetailView
        item={item}
        loading={loading}
        refresh={refresh}
        isAdmin={isAdmin}
        backPath="/projects"
        backLabel="Volver a proyectos"
        notFoundLabel="Proyecto no encontrado"
        loaderLabel="Cargando proyecto..."
        editTitle="Editar Proyecto"
        autoresKey="integrantes"
        showAutores={true}
        showVideos={true}
        autoresLabel="Integrantes"
        showDeleteButton={true}
        extraFields={[
          { label: "Estado",       value: project?.estado },
          { label: "Fecha inicio", value: project?.fecha_inicio },
          { label: "Fecha fin",    value: project?.fecha_fin },
        ]}
        toApiPayload={(form) => ({
          titulo:      form.title,
          descripcion: form.content,
          objetivos:   form.description,
          image:       form.image   || "",  
          gallery:     form.gallery || [],   
          integrantes: (form.autores || []).map((a) => ({
            miembro_id:     a.miembro_id     || "",
            nombre_externo: a.nombre_externo || "",
            rol:            a.rol            || "Integrante",
          })),
        })}
        onUpdate={updateProject}
        onDeleteClick={() => setConfirmDelete(true)}
      />

      <ConfirmModal
        open={confirmDelete}
        title="Eliminar proyecto"
        message={`¿Eliminar "${project?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
import { useAuth } from "../../features/auth/model/useAuth";
import { useProjectDetail } from "../../entities/project/model/useProjectDetail";
import ProjectDetailView from "../../entities/project/ui/ProjectDetailView";

export default function ProjectDetailWidget() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { project, loading, refresh } = useProjectDetail();

  return (
    <ProjectDetailView
      project={project}
      loading={loading}
      refresh={refresh}
      isAdmin={isAdmin}
    />
  );
}
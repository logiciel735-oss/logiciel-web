// import { useCMSData } from "../../../shared/lib/useCMSData";
// import { getProjects } from "../api/projectApi";

// export function useProjects(estado) {

//   const {
//     data,
//     loading,
//     refresh,
//   } = useCMSData(
//     `cms_proyectos_${estado}`,
//     () => getProjects(estado)
//   );

//   const projects = Array.isArray(data) ? data : [];

//   return {
//     projects,
//     loading,
//     refresh,
//   };
// }

import { useCMSData } from "../../../shared/lib/useCMSData";
import { getProjects } from "../api/projectApi";

export function useProjects(estado) {
  const { data, loading, refresh } = useCMSData(
    "cms_proyectos",
    getProjects
  );

  let projects = Array.isArray(data) ? data : [];

  // Filtrado opcional por estado en el cliente si es necesario
  if (estado && projects.length > 0) {
    projects = projects.filter((p) => p.estado === estado);
  }

  return {
    projects,
    loading,
    refresh,
  };
}
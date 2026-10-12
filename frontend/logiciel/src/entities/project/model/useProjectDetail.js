// import { useParams } from "react-router-dom";
// import { useCMSData } from "../../../shared/lib/useCMSData";
// import { getProject } from "../api/projectApi";

// export function useProjectDetail() {

//   const { id } = useParams();
  

//   const {
//     data,
//     loading,
//     refresh,
//   } = useCMSData(
//     `cms_project_${id}`,
//     () => getProject(id)
//   );

//   return {
//     project: data,
//     loading,
//     refresh,
//     id,
//   };
// }
import { useParams } from "react-router-dom";
import { useCMSData } from "../../../shared/lib/useCMSData";
import { getProject } from "../api/projectApi";

export function useProjectDetail() {
  const { id } = useParams();

  const { data, loading, refresh } = useCMSData(
    `cms_project_${id}`,
    () => getProject(id)
  );

  return {
    project: data,
    loading,
    refresh,
    id,
  };
}
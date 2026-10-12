import { Link, useParams } from "react-router-dom";

import { useMiembroDetail } from "../../entities/member/model/useMiembroDetail";
import MemberDetailView from "../../entities/member/ui/MemberDetailView";

export default function MemberDetailWidget() {
  const { uid } = useParams();

  const {
    member, activos, finalizados, publicaciones, noticias,
    loading, loadingRelated, error, notFound, refresh,
  } = useMiembroDetail(uid);

  if (notFound) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
      <h2 className="text-2xl font-bold text-[#0a192f]">Miembro no encontrado</h2>
      <p className="text-gray-600 max-w-md">
        Este perfil no corresponde a ningún miembro registrado del grupo LOGICIEL.
      </p>
      <Link
        to="/about"
        className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
      >
        Ver miembros del grupo
      </Link>
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
      <h2 className="text-2xl font-bold text-red-600">No se pudo cargar el perfil</h2>
      <p className="text-gray-600 max-w-md">{error}</p>
      <button
        onClick={refresh}
        className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <MemberDetailView
      member={member}
      activos={activos}
      finalizados={finalizados}
      publicaciones={publicaciones}
      noticias={noticias}
      loading={loading}
      loadingRelated={loadingRelated}
    />
  );
}

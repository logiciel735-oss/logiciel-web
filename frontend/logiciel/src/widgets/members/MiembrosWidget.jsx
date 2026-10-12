
// //Version Dinamica 
// import { useState } from "react";
// import toast from "react-hot-toast";

// import { useAuth } from "../../features/auth/model/useAuth";
// import { useMiembros } from "../../entities/member/model/useMiembros";
// import MiembroCard from "../../entities/member/ui/MiembroCard";
// import MiembroModal from "../../entities/member/ui/MiembroModal";
// import ConfirmModal from "../../shared/ui/ConfirmModal";
// import { useCircularHorizontalScroll } from "../../shared/hooks/design/useCircularHorizontalScroll";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// import Loader from "../../shared/components/Loader";
// import {
//   createMiembro,
//   updateMiembro,
//   deleteMiembro,
// } from "../../features/adminUsers/api/adminUsersApi";

// export default function MiembrosWidget() {
//   const { user, token } = useAuth();
//   const isAdmin = user?.role === "admin";

//   const { miembros, loading, refresh } = useMiembros();

//   const { ref, hasOverflow, scrollLeft, scrollRight } =
//     useCircularHorizontalScroll([miembros]);

//   const [openModal, setOpenModal] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const handleSave = async () => {
//     try {
//       if (editData?.id) {
//         await updateMiembro(editData.id, editData, token);
//         toast.success("Miembro actualizado correctamente");
//       } else {
//         await createMiembro(editData, token);
//         toast.success("Miembro creado correctamente");
//       }
//       await refresh();
//       setOpenModal(false);
//       setEditData(null);
//     } catch {
//       toast.error("Error guardando miembro");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteMiembro(confirmDelete.id, token);
//       toast.success("Miembro eliminado correctamente");
//       await refresh();
//       setConfirmDelete(null);
//     } catch {
//       toast.error("Error eliminando miembro");
//     }
//   };



//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-6xl mx-auto px-6">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold">Miembros</h2>
//           {isAdmin && (
//             <button
//               onClick={() => { setEditData({ user_id: "", role: "" }); setOpenModal(true); }}
//               className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
//             >
//               + Nuevo Miembro
//             </button>
//           )}
//         </div>


//         {/* SLIDER */}
//         <div className="relative"> {/* ✅ quita overflow-hidden */}

//           {/* botón izquierda — siempre visible */}
//           <button
//             onClick={scrollLeft}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white shadow-md hover:bg-teal-50 border border-gray-200 p-2 rounded-full transition-all"
//           >
//             <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
//           </button>

//           {/* cards con padding para que no queden detrás de los botones */}
//           <div
//             ref={ref}
//             className="flex gap-4 overflow-x-auto pb-4 scroll-smooth px-10"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {loading ? (
//               <div className="w-full flex justify-center py-10">
//                 <Loader text="Cargando miembros..." />
//               </div>
//             ) : miembros.length === 0 ? (
//               <div className="w-full text-center text-gray-500 py-10">
//                 No hay miembros disponibles
//               </div>
//             ) : (
//               miembros.map((miembro) => (
//                 <div key={miembro.id} className="flex-shrink-0">
//                   <MiembroCard
//                     miembro={miembro}
//                     isAdmin={isAdmin}
//                     onEdit={(item) => { setEditData(item); setOpenModal(true); }}
//                     onDelete={(item) => setConfirmDelete(item)}
//                   />
//                 </div>
//               ))
//             )}
//           </div>

//           {/* botón derecha — siempre visible */}
//           <button
//             onClick={scrollRight}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white shadow-md hover:bg-teal-50 border border-gray-200 p-2 rounded-full transition-all"
//           >
//             <ChevronRightIcon className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>

//         {openModal && (
//           <MiembroModal
//             data={editData}
//             onChange={(k, v) => setEditData((prev) => ({ ...prev, [k]: v }))}
//             onSave={handleSave}
//             onClose={() => { setOpenModal(false); setEditData(null); }}
//           />
//         )}

//       </div>
//       <ConfirmModal
//         open={!!confirmDelete}
//         title="Eliminar Miembro"
//         message={`¿Seguro que deseas eliminar "${confirmDelete?.name}"?`}
//         confirmText="Eliminar"
//         cancelText="Cancelar"
//         onConfirm={handleDelete}
//         onCancel={() => setConfirmDelete(null)}
//       />
//     </section>
//   );
// }

//Version Estatica

import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { useAuth } from "../../features/auth/model/useAuth";
import { useMiembros } from "../../entities/member/model/useMiembros";
import MiembroCard from "../../entities/member/ui/MiembroCard";
import MiembroCardEstatico from "../../shared/data/MiembroCardEstatico";
import MiembroModal from "../../entities/member/ui/MiembroModal";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import { useCircularHorizontalScroll } from "../../shared/hooks/design/useCircularHorizontalScroll";
import { MIEMBROS_ESTATICOS } from "../../shared/data/miembrosStaticos";

import {
  createMiembro,
  updateMiembro,
  deleteMiembro,
} from "../../features/adminUsers/api/adminUsersApi";

export default function MiembrosWidget() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const { miembros, loading, refresh } = useMiembros();

  const { ref, hasOverflow, scrollLeft, scrollRight } =
    useCircularHorizontalScroll([miembros]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    try {
      if (editData?.id) {
        await updateMiembro(editData.id, editData, token);
        toast.success("Miembro actualizado correctamente");
      } else {
        await createMiembro(editData, token);
        toast.success("Miembro creado correctamente");
      }
      await refresh();
      setOpenModal(false);
      setEditData(null);
    } catch {
      toast.error("Error guardando miembro");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMiembro(confirmDelete.id, token);
      toast.success("Miembro eliminado correctamente");
      await refresh();
      setConfirmDelete(null);
    } catch {
      toast.error("Error eliminando miembro");
    }
  };

  if (loading) return (
    <section className="py-16 text-center">Cargando miembros...</section>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Miembros</h2>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-teal-600 font-bold">
              {miembros.length + MIEMBROS_ESTATICOS.length}
            </span>{" "}
            miembros en el grupo
          </p>
          {isAdmin && (
            <button
              onClick={() => { setEditData({ user_id: "", role: "" }); setOpenModal(true); }}
              className="bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              + Nuevo Miembro
            </button>
          )}
        </div>

        {/* SLIDER */}
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <div
            ref={ref}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* ✅ Miembros reales de Firebase */}
            {miembros.map((miembro) => (
              <div key={miembro.id} className="flex-shrink-0">
                <MiembroCard
                  miembro={miembro}
                  isAdmin={isAdmin}
                  onEdit={(item) => { setEditData(item); setOpenModal(true); }}
                  onDelete={(item) => setConfirmDelete(item)}
                />
              </div>
            ))}

            {/* ✅ Miembros estáticos — mismo diseño, sin navegación */}
            {MIEMBROS_ESTATICOS.map((miembro) => (
              <div key={miembro.id} className="flex-shrink-0">
                <MiembroCardEstatico miembro={miembro} />
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-[#64ffda] hover:text-[#0a192f] p-3 rounded-full transition-all border border-white/20"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {openModal && (
        <MiembroModal
          data={editData}
          onChange={(k, v) => setEditData((prev) => ({ ...prev, [k]: v }))}
          onSave={handleSave}
          onClose={() => { setOpenModal(false); setEditData(null); }}
        />
      )}

      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar Miembro"
        message={`¿Seguro que deseas eliminar "${confirmDelete?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}
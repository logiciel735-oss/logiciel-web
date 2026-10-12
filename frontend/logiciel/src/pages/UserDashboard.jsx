// import React from "react";
// import { useAuth } from "../features/auth/model/useAuth";

// const UserDashboard = () => {
//   const { user } = useAuth();

//   return (
//     <div className="p-6 min-h-screen bg-[#f5faf8]">
//       <h1 className="text-3xl font-bold text-[#0a192f] mb-6">
//         Bienvenido, {user?.name || "Usuario"}
//       </h1>

//       {/* Tarjeta principal */}
//       <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
//         <h2 className="text-2xl font-semibold text-[#0a192f] mb-4">
//           Tu información
//         </h2>

//         <div className="space-y-4 text-lg">
//           <p>
//             <strong>Correo:</strong> {user.email}
//           </p>

//           <p>
//             <strong>Rol:</strong>{" "}
//             <span className="text-green-600 font-semibold">{user.role}</span>
//           </p>
//         </div>

//         {/* botón de editar */}
//         <button
//           className="mt-6 px-6 py-3 rounded-md bg-[#64ffda] text-[#0a192f] font-bold hover:bg-teal-300 transition"
//         >
//           Editar perfil
//         </button>
//       </div>

//       {/* Cards opcionales */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
//         <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-300">
//           <h3 className="font-bold text-xl text-[#0a192f]">Actividad</h3>
//           <p className="mt-2 text-gray-700">
//             Mira tu historial, tus acciones y datos recientes.
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-300">
//           <h3 className="font-bold text-xl text-[#0a192f]">Preferencias</h3>
//           <p className="mt-2 text-gray-700">
//             Personaliza tu experiencia en la plataforma.
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-300">
//           <h3 className="font-bold text-xl text-[#0a192f]">Notificaciones</h3>
//           <p className="mt-2 text-gray-700">
//             Revisa mensajes, alertas importantes o avisos.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

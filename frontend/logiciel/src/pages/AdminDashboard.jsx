// import React, { useEffect, useState } from "react";
// import { useAuth } from "../features/auth/model/useAuth";
// import toast from "react-hot-toast";
// const AdminDashboard = () => {
//   const { user, token } = useAuth();
//   const [users, setUsers] = useState([]);

//   // Obtiene todos los usuarios desde backend
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/users/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error("Error cargando usuarios:", err);
//     }
//   };

//   // Promover a admin
//   const promote = async (uid) => {
//     try {
//       await fetch(`http://127.0.0.1:8000/api/admin/promote/${uid}/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       fetchUsers(); // recarga lista
//       toast.success("Usuario promovido a admin");
//     } catch (err) {
//       toast.error("Error al promover usuario");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen bg-[#eaf3f1]">
//       <h1 className="text-3xl font-bold text-[#0a192f] mb-6">
//         Panel de Administrador
//       </h1>

//       {/* Tarjetas resumen */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-[#64ffda]">
//           <h2 className="text-xl font-semibold text-[#0a192f]">
//             Total Usuarios
//           </h2>
//           <p className="text-4xl font-bold mt-2">{users.length}</p>
//         </div>

//         <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-400">
//           <h2 className="text-xl font-semibold text-[#0a192f]">
//             Administradores
//           </h2>
//           <p className="text-4xl font-bold mt-2">
//             {users.filter((u) => u.role === "admin").length}
//           </p>
//         </div>

//         <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-rose-400">
//           <h2 className="text-xl font-semibold text-[#0a192f]">
//             Usuarios normales
//           </h2>
//           <p className="text-4xl font-bold mt-2">
//             {users.filter((u) => u.role === "user").length}
//           </p>
//         </div>
//       </section>

//       {/* Tabla de usuarios */}
//       <div className="bg-white shadow-xl rounded-xl p-6">
//         <h2 className="text-2xl font-semibold text-[#0a192f] mb-4">
//           Gestión de Usuarios
//         </h2>

//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-[#0a192f] text-white">
//               <th className="p-3 text-left">Nombre</th>
//               <th className="p-3 text-left">Correo</th>
//               <th className="p-3 text-left">Rol</th>
//               <th className="p-3 text-left">Acciones</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((u) => (
//               <tr
//                 key={u.id}
//                 className="border-b hover:bg-gray-100 transition"
//               >
//                 <td className="p-3">{u.name}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td
//                   className={`p-3 font-semibold ${
//                     u.role === "admin" ? "text-green-600" : "text-gray-700"
//                   }`}
//                 >
//                   {u.role}
//                 </td>
//                 <td className="p-3">
//                   {u.role === "user" && (
//                     <button
//                       onClick={() => promote(u.id)}
//                       className="px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-md hover:bg-teal-300 transition font-semibold"
//                     >
//                       Promover a Admin
//                     </button>
//                   )}

//                   {u.role === "admin" && (
//                     <span className="text-gray-400 italic">
//                       (Ya es admin)
//                     </span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

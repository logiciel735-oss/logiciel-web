import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  getAllUsers,
  updateUserById,
  deleteUserById,
  promoteUserToAdmin,
  setUserRole,
} from "../api/adminUsersApi";
import { ROLE_LABELS } from "../../auth/model/permissions";
import { cmsCache } from "../../../shared/utils/cmsCache";

export const useAdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Recarga la lista en segundo plano (la tabla sigue visible mientras tanto)
  const loadUsers = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const data = await getAllUsers();
        if (active) setUsers(data);
      } catch (error) {
        console.error(error);
        if (active) toast.error("Error cargando usuarios");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => { active = false; };
  }, [reloadKey]);

  const updateUser = async (uid, data) => {
    try {
      await updateUserById(uid, data);
      toast.success("Usuario actualizado");
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error actualizando usuario");
    }
  };

  const deleteUser = async (uid) => {
    try {
      await deleteUserById(uid);
      // Su ficha de miembro se borra en la BD (trigger); que la lista no la muestre desde la caché
      cmsCache.invalidate("miembros");
      toast.success("Usuario eliminado");
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error eliminando usuario");
    }
  };

  const promoteUser = async (uid) => {
    try {
      await promoteUserToAdmin(uid);
      toast.success("Usuario promovido a admin");
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error promoviendo usuario");
    }
  };

  const changeRole = async (uid, role) => {
    try {
      await setUserRole(uid, role);
      toast.success(`Rol cambiado a ${ROLE_LABELS[role] || role}`);
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.message?.includes("propio rol")
        ? "No puedes cambiar tu propio rol"
        : "Error cambiando el rol");
    }
  };

  return {
    users,
    loading,
    updateUser,
    deleteUser,
    promoteUser,
    changeRole,
    reloadUsers: loadUsers,
  };
};

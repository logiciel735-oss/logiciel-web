import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  getAllUsers,
  updateUserById,
  deleteUserById,
  promoteUserToAdmin,
} from "../api/adminUsersApi";

export const useAdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (uid, data) => {
    try {
      await updateUserById(uid, data);
      toast.success("Usuario actualizado");
      loadUsers();
    } catch (error) {
      toast.error("Error actualizando usuario");
    }
  };

  const deleteUser = async (uid) => {
    try {
      await deleteUserById(uid);
      toast.success("Usuario eliminado");
      loadUsers();
    } catch (error) {
      toast.error("Error eliminando usuario");
    }
  };

  const promoteUser = async (uid) => {
    try {
      await promoteUserToAdmin(uid);
      toast.success("Usuario promovido a admin");
      loadUsers();
    } catch (error) {
      toast.error("Error promoviendo usuario");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    updateUser,
    deleteUser,
    promoteUser,
    reloadUsers: loadUsers,
  };
};
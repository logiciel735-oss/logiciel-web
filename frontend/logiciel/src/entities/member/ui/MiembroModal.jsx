import { useEffect, useState } from "react";
import { getPublicUsers } from "../../../features/adminUsers/api/adminUsersApi";
import { getMiembros } from "../api/miembroApi";
import toast from "react-hot-toast";

export default function MiembroModal({
    data,
    onChange,
    onSave,
    onClose,
}) {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const isEditing = Boolean(data?.id);

    useEffect(() => {

        const loadData = async () => {

            try {

                const [usersData, miembrosData] = await Promise.all([
                    getPublicUsers(),
                    getMiembros(),
                ]);

                const memberIds = miembrosData.map((m) => m.user_id);

                const filteredUsers = usersData.filter(
                    (u) => !memberIds.includes(u.id)
                );

                setUsers(filteredUsers);

            } catch (err) {

                console.error("Error cargando usuarios", err);

            }
        };

        loadData();

    }, []);

    const handleSelectUser = (user) => {

        setSelectedUser(user);

        onChange("user_id", user.id);

    };
    const handleSave = () => {

        if (!data?.user_id) {
            toast("Debes seleccionar un usuario antes de agregarlo como miembro.", {
                icon: "ℹ️",
                style: {
                    background: "#FEF3C7",
                    color: "#92400E",
                },
            });
            return;
        }

        if (!data?.role) {

            toast("Debes seleccionar un rol para el miembro.", {
                icon: "ℹ️",
                style: {
                    background: "#FEF3C7",
                    color: "#92400E",
                },
            });
            return;
        }

        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl p-6 w-[650px] max-h-[80vh] overflow-y-auto">
                {!isEditing && (
                    <>
                        <h3 className="text-lg font-semibold mb-3">
                            Seleccionar usuario
                        </h3>

                        <div className="flex gap-4 overflow-x-auto pb-4 mb-6">

                            {users.map((user) => (

                                <button
                                    key={user.id}
                                    onClick={() => handleSelectUser(user)}
                                    className={`min-w-[120px] p-4 border rounded-xl flex flex-col items-center hover:shadow transition
          ${selectedUser?.id === user.id ? "border-teal-600" : ""}
          `}
                                >

                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-16 h-16 rounded-full object-cover mb-2"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold mb-2">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <span className="text-sm text-center">
                                        {user.name}
                                    </span>

                                </button>

                            ))}

                        </div>
                    </>
                )}

                {/* ROLE */}

                <div className="mb-4">

                    <label className="block text-sm mb-1">
                        Rol
                    </label>

                    <select
                        value={data?.role || ""}
                        onChange={(e) => onChange("role", e.target.value)}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">Seleccionar rol</option>

                        <option value="director">Director</option>
                        <option value="coordinador">Coordinador</option>
                        <option value="investigador">Investigador</option>
                        <option value="docente">Docente</option>
                        <option value="estudiante">Estudiante</option>
                        <option value="administrativo">Administrativo</option>

                    </select>

                </div>

                {/* ACTIONS */}

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                    >
                        Guardar
                    </button>

                </div>

            </div>
        </div>
    );
}
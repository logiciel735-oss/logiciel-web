import { useEffect, useState } from "react";
import { getPublicUsers } from "../../../features/adminUsers/api/adminUsersApi";
import { getMiembros } from "../api/miembroApi";
import toast from "react-hot-toast";
import Modal from "../../../shared/ui/Modal";
import FormField from "../../../shared/ui/FormField";
import { optimizeImage } from "../../../shared/lib/image";
import { MEMBER_ROLES } from "../model/memberRoles";

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
                toast.error("No se pudo cargar la lista de usuarios");

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
        <Modal
            title={isEditing ? "Editar miembro" : "Nuevo miembro"}
            description={isEditing ? undefined : "Selecciona un usuario registrado y asígnale un rol en el grupo."}
            onClose={onClose}
            size="xl"
            footer={
                <>
                    <button onClick={onClose} className="btn-secondary">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="btn-primary">
                        Guardar
                    </button>
                </>
            }
        >
            {!isEditing && (
                <FormField label="Usuario">
                    {users.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-sm text-slate-500">
                            No hay usuarios disponibles para agregar.
                        </p>
                    ) : (
                        <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
                            {users.map((user) => {
                                const selected = selectedUser?.id === user.id;
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => handleSelectUser(user)}
                                        className={`flex flex-col items-center rounded-xl border p-3 text-center transition ${selected
                                            ? "border-brand-teal bg-brand-teal-light ring-2 ring-brand-teal/40"
                                            : "border-slate-200 hover:border-brand-teal/50 hover:bg-slate-50"
                                            }`}
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={optimizeImage(user.avatar, 160)}
                                                alt={user.name}
                                                className="mb-2 h-14 w-14 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-lg font-semibold text-white">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="line-clamp-2 text-xs font-medium text-slate-700">
                                            {user.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </FormField>
            )}

            <FormField label="Rol en el grupo">
                <select
                    value={data?.role || ""}
                    onChange={(e) => onChange("role", e.target.value)}
                    className="input-base"
                >
                    <option value="">Seleccionar rol</option>
                    {MEMBER_ROLES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </FormField>
        </Modal>
    );
}

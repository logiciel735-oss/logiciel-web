import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/model/useAuth";
import { useMiembros } from "../../../entities/member/model/useMiembros";

export function useNavbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { miembros, loading } = useMiembros();

  // 🔥 Derivación de estado (no fetch manual)
  const miLider = useMemo(() => {
    if (!user) return null;

    return miembros.find(
      (m) => String(m.user_id) === String(user.uid)
    ) || null;
  }, [miembros, user]);

  const checkedLider = !loading;

  const handleDropdownToggle = () => {
    if (window.innerWidth < 768) {
      setDropdown((prev) => !prev);
    }
  };

  const handleCloseMenu = () => {
    setOpen(false);
  };

  const handleProfileNavigation = () => {
    if (miLider) {
      navigate(`/members/${miLider.user_id}`);
      handleCloseMenu();
    }
  };

  const handleLogout = async () => {
    await logout();
    handleCloseMenu();
  };

  return {
    open,
    setOpen,
    dropdown,
    setDropdown,
    user,
    miLider,
    checkedLider,
    handleDropdownToggle,
    handleCloseMenu,
    handleProfileNavigation,
    handleLogout,
  };
}
import { useState } from "react";
import { useAuth } from "../../../features/auth/model/useAuth";

export function useNavbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const { user, logout } = useAuth();

  const handleDropdownToggle = () => {
    if (window.innerWidth < 768) {
      setDropdown((prev) => !prev);
    }
  };

  const handleCloseMenu = () => {
    setOpen(false);
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
    handleDropdownToggle,
    handleCloseMenu,
    handleLogout,
  };
}

import { useState, useEffect } from "react";
import { AuthContext } from "../model/authContext";
import { supabase } from "../../../shared/config/supabase";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
} from "../api/authApi";
import { getMyProfile } from "../api/profileApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const profile = await getMyProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
        return;
      }

      // setTimeout: no se debe llamar a Supabase dentro del callback (bloqueo)
      if (["INITIAL_SESSION", "SIGNED_IN", "USER_UPDATED"].includes(event)) {
        setTimeout(loadUser, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    await loginRequest(email, password);
    await loadUser();
  };

  const register = async (name, email, password) => {
    const result = await registerRequest(name, email, password);
    if (!result.needsConfirmation) await loadUser();
    return result;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, login, register, logout, loading, isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

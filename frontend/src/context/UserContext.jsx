import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { UserContext } from "./coreUserContext";

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setUser(null);
        if (mounted) setLoading(false);
        return;
      }
      try {
        const resp = await apiGet("/users/me");
        if (mounted && resp && resp.user) setUser(resp.user);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    const onStorage = () => {
      // when token changes in another tab
      const t = localStorage.getItem("token");
      if (!t) {
        setUser(null);
        setLoading(false);
      } else {
        loadUser();
      }
    };

    const onLogout = () => {
      // handle auth:logout dispatched from api
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:logout", onLogout);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:logout", onLogout);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.hash = "#/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

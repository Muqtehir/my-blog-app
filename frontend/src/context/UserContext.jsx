import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setUser(null);
        return;
      }
      try {
        const resp = await apiGet("/users/me");
        if (mounted && resp && resp.user) setUser(resp.user);
      } catch {
        if (mounted) setUser(null);
      }
    }

    loadUser();

    const onStorage = () => {
      // when token changes in another tab
      const t = localStorage.getItem("token");
      if (!t) setUser(null);
      else loadUser();
    };

    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.hash = "#/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

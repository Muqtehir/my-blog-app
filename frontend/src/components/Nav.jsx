import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function Nav() {
  const [route, setRoute] = useState(() =>
    (window.location.hash || "#/").replace(/^#/, "")
  );

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onHash = () => {
      setRoute((window.location.hash || "#/").replace(/^#/, ""));
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("hashchange", onHash);
    // also listen to storage changes from other tabs
    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // fetch current user when token is present
  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      const t = localStorage.getItem("token");
      if (!t) {
        if (mounted) setUser(null);
        return;
      }
      try {
        const resp = await apiGet("/users/me");
        if (mounted && resp && resp.user) setUser(resp.user);
      } catch (err) {
        // if token invalid or error, clear user
        if (mounted) setUser(null);
      }
    }
    loadUser();
    return () => (mounted = false);
  }, [token]);

  const isActive = (path) => {
    if ((route === "" || route === "/") && path === "/") return true;
    return route === path;
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#/">
          My Blog
        </a>
        <nav aria-label="Main navigation">
          <a className={`nav-link ${isActive("/") ? "active" : ""}`} href="#/">
            Home
          </a>
          <a
            className={`nav-link ${isActive("/create") ? "active" : ""}`}
            href="#/create"
          >
            Create Blog
          </a>
          <a
            className={`nav-link ${isActive("/posts") ? "active" : ""}`}
            href="#/posts"
          >
            Posts
          </a>
          {!token ? (
            <>
              <a
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
                href="#/login"
              >
                Login
              </a>
              <a
                className={`nav-link cta ${
                  isActive("/signup") ? "active" : ""
                }`}
                href="#/signup"
              >
                Signup
              </a>
            </>
          ) : (
            <>
              <a className="nav-link" href="#/create">
                New
              </a>
              {user && (
                <span className="nav-user" style={{ marginRight: 12 }}>
                  {user.username}
                </span>
              )}
              <button
                className="nav-link cta"
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken(null);
                  setUser(null);
                  window.location.hash = "#/";
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

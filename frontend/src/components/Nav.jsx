import React, { useEffect, useState } from "react";

export default function Nav() {
  const [route, setRoute] = useState(() =>
    (window.location.hash || "#/").replace(/^#/, "")
  );

  const [token, setToken] = useState(() => localStorage.getItem("token"));

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
              <button
                className="nav-link cta"
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken(null);
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

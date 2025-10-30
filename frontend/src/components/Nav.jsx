import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function Nav() {
  const [route, setRoute] = useState(() =>
    (window.location.hash || "#/").replace(/^#/, "")
  );

  const { user, logout } = useUser();

  useEffect(() => {
    const onHash = () => {
      setRoute((window.location.hash || "#/").replace(/^#/, ""));
    };
    window.addEventListener("hashchange", onHash);
    // also listen to storage changes from other tabs
    // user context listens for storage updates; no local token state needed here
    // keep nav responsive to storage changes as well
    const onStorage = () => {
      // no-op here; context will handle user updates
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // user is provided by UserContext

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
          {!user ? (
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
                  logout();
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

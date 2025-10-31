import React, { useEffect, useState } from "react";
import { useUser } from "../context/coreUserContext";

export default function Nav() {
  const [route, setRoute] = useState(() =>
    (window.location.hash || "#/").replace(/^#/, "")
  );

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // user is provided by UserContext

  const isActive = (path) => {
    if ((route === "" || route === "/") && path === "/") return true;
    return route === path;
  };

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="brand" href="#/" onClick={() => setOpen(false)}>
          My Blog
        </a>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((s) => !s)}
        >
          ☰
        </button>
        <button
          className="nav-toggle theme-toggle"
          aria-pressed={dark}
          aria-label="Toggle theme"
          onClick={() => setDark((d) => !d)}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? "🌙" : "🌞"}
        </button>
        <nav className={open ? "open" : ""} aria-label="Main navigation">
          <div style={{ display: "inline-block", marginRight: 12 }}>
            <input
              placeholder="Search posts..."
              aria-label="Search posts"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = e.target.value.trim();
                  try {
                    window.dispatchEvent(
                      new CustomEvent("search:query", { detail: { q } })
                    );
                  } catch (err) {
                    void err;
                  }
                }
              }}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
          </div>
          <a
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            href="#/"
            onClick={() => setOpen(false)}
          >
            Home
          </a>
          <a
            className={`nav-link ${isActive("/create") ? "active" : ""}`}
            href="#/create"
            onClick={() => setOpen(false)}
          >
            Create Blog
          </a>
          <a
            className={`nav-link ${isActive("/posts") ? "active" : ""}`}
            href="#/posts"
            onClick={() => setOpen(false)}
          >
            Posts
          </a>
          {!user ? (
            <>
              <a
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
                href="#/login"
                onClick={() => setOpen(false)}
              >
                Login
              </a>
              <a
                className={`nav-link cta ${
                  isActive("/signup") ? "active" : ""
                }`}
                href="#/signup"
                onClick={() => setOpen(false)}
              >
                Signup
              </a>
            </>
          ) : (
            <>
              <a
                className="nav-link new-post"
                href="#/create"
                onClick={() => setOpen(false)}
              >
                New Post
              </a>
              {user && (
                <>
                  <a
                    className="nav-link"
                    href={`#/profile/${user.username}`}
                    style={{ marginRight: 8 }}
                    onClick={() => setOpen(false)}
                  >
                    {user.username}
                  </a>
                </>
              )}
              <button
                className="nav-link cta"
                onClick={() => {
                  setOpen(false);
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

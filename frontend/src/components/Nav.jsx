import React, { useEffect, useState } from "react";

export default function Nav() {
  const [route, setRoute] = useState(() =>
    (window.location.hash || "#/").replace(/^#/, "")
  );

  useEffect(() => {
    const onHash = () =>
      setRoute((window.location.hash || "#/").replace(/^#/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
          <a
            className={`nav-link ${isActive("/login") ? "active" : ""}`}
            href="#/login"
          >
            Login
          </a>
          <a
            className={`nav-link cta ${isActive("/signup") ? "active" : ""}`}
            href="#/signup"
          >
            Signup
          </a>
        </nav>
      </div>
    </header>
  );
}

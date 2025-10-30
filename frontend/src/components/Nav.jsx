import React from "react";

export default function Nav() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#/">
          My Blog
        </a>
        <nav aria-label="Main navigation">
          <a className="nav-link" href="#/">
            Home
          </a>
          <a className="nav-link" href="#/create">
            Create Blog
          </a>
          <a className="nav-link" href="#/posts">
            Posts
          </a>
          <a className="nav-link" href="#/login">
            Login
          </a>
          <a className="nav-link cta" href="#/signup">
            Signup
          </a>
        </nav>
      </div>
    </header>
  );
}

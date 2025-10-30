import React from "react";

export default function Home() {
  return (
    <main className="home-page" style={{ padding: 48 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", color: "#fff" }}>
        <h1 style={{ marginTop: 0 }}>Welcome</h1>
        <p>
          This is a small demo blog front-end. Use the navigation to view the
          Create Blog page and other placeholders. The real app would include
          authentication, posts listing, and CRUD for posts.
        </p>
      </div>
    </main>
  );
}
